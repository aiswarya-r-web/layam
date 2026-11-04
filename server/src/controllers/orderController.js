import mongoose from 'mongoose'
import Cart from '../models/Cart.js'
import Coupon from '../models/Coupon.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { getStripe } from '../config/stripe.js'
import { applyCoupon, deliveryChargeFor } from '../utils/pricing.js'

const rollbackOrder = async (order) => {
  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session }
        )
      }
      if (order.couponCode) {
        await Coupon.updateOne(
          { code: order.couponCode, usedCount: { $gt: 0 } },
          { $inc: { usedCount: -1 } },
          { session }
        )
      }
      await Cart.findOneAndUpdate(
        { userId: order.userId },
        {
          items: order.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
        { session }
      )
      await Order.deleteOne({ _id: order._id }, { session })
    })
  } finally {
    session.endSession()
  }
}

const validateCoupon = async (code, subtotal, userId) => {
  if (!code) return { coupon: null, discount: 0 }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })
  if (!coupon) return { error: 'Invalid coupon code' }
  if (coupon.userId && coupon.userId.toString() !== userId.toString()) {
    return { error: 'This coupon is linked to another account' }
  }
  if (coupon.expiryDate < new Date()) return { error: 'Coupon has expired' }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { error: 'Coupon usage limit reached' }
  }
  if (subtotal < coupon.minimumOrderAmount) {
    return { error: `Minimum order ₹${coupon.minimumOrderAmount} required` }
  }
  return { coupon, discount: applyCoupon(coupon, subtotal) }
}

export const createOrder = async (req, res) => {
  const { shippingAddress, couponCode, paymentMethod = 'cod' } = req.body

  if (!shippingAddress?.name || !shippingAddress?.street || !shippingAddress?.city) {
    return res.status(400).json({ message: 'Complete shipping address is required' })
  }
  if (!['cod', 'stripe'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Unsupported payment method' })
  }

  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId')
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' })
  }

  const session = await mongoose.startSession()
  try {
    let order
    await session.withTransaction(async () => {
      const items = []
      let subtotal = 0

      for (const item of cart.items) {
        const product = item.productId
        if (!product || !product.isActive) {
          throw new Error(`Product unavailable: ${product?.name || item.productId}`)
        }
        const updated = await Product.findOneAndUpdate(
          { _id: product._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session, returnDocument: 'after' }
        )
        if (!updated) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }
        items.push({
          productId: product._id,
          productName: product.name,
          image: product.images?.[0],
          quantity: item.quantity,
          price: product.price,
        })
        subtotal += product.price * item.quantity
      }

      const { coupon, discount, error } = await validateCoupon(couponCode, subtotal, req.user._id)
      if (error) throw new Error(error)

      const deliveryCharge = deliveryChargeFor(subtotal)
      const totalAmount = subtotal - discount + deliveryCharge

      ;[order] = await Order.create(
        [
          {
            userId: req.user._id,
            items,
            shippingAddress,
            subtotal,
            discount,
            deliveryCharge,
            totalAmount,
            couponCode: coupon?.code,
            paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'pending',
          },
        ],
        { session }
      )

      if (coupon) {
        await Coupon.updateOne(
          { _id: coupon._id },
          { $inc: { usedCount: 1 } },
          { session }
        )
      }

      cart.items = []
      await cart.save({ session })
    })

    if (paymentMethod === 'cod') {
      return res.status(201).json({ order })
    }

    const stripe = getStripe()
    if (!stripe) {
      await rollbackOrder(order)
      return res.status(503).json({ message: 'Online payment is not configured' })
    }

    try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

      const itemCount = order.items.reduce((s, i) => s + i.quantity, 0)
      const lineItems = [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Layam order #${order._id.toString().slice(-8).toUpperCase()} — ${itemCount} item${itemCount > 1 ? 's' : ''}`,
            },
            unit_amount: Math.round(order.subtotal * 100),
          },
          quantity: 1,
        },
      ]
      if (order.deliveryCharge > 0) {
        lineItems.push({
          price_data: {
            currency: 'inr',
            product_data: { name: 'Delivery charge' },
            unit_amount: Math.round(order.deliveryCharge * 100),
          },
          quantity: 1,
        })
      }

      let discounts
      if (order.discount > 0 && order.totalAmount > 0) {
        const stripeCoupon = await stripe.coupons.create({
          amount_off: Math.round(order.discount * 100),
          currency: 'inr',
          duration: 'once',
          name: order.couponCode || 'Discount',
        })
        discounts = [{ coupon: stripeCoupon.id }]
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        discounts,
        metadata: {
          type: 'order',
          orderId: order._id.toString(),
          userId: req.user._id.toString(),
        },
        payment_intent_data: {
          metadata: { orderId: order._id.toString(), type: 'order' },
        },
        client_reference_id: req.user._id.toString(),
        customer_email: req.user.email,
        success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/checkout?cancelled=1`,
      })
      order.stripeSessionId = session.id
      await order.save()
      res.json({ url: session.url, orderId: order._id })
    } catch (err) {
      await rollbackOrder(order)
      res.status(502).json({ message: 'Could not start payment. Please try again.' })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  } finally {
    session.endSession()
  }
}

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 })
  res.json({ orders })
}

export const getOrderById = async (req, res) => {
  const query =
    req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.user._id }
  const order = await Order.findOne(query)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json({ order })
}

export const cancelOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    return res.status(400).json({ message: `Cannot cancel a ${order.orderStatus} order` })
  }

  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session }
        )
      }
      order.orderStatus = 'cancelled'
      await order.save({ session })
    })
    res.json({ message: 'Order cancelled', order })
  } finally {
    session.endSession()
  }
}
