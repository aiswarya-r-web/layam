import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { deliveryChargeFor } from '../utils/pricing.js'

const cartResponse = (cart) => {
  const items = (cart?.items || []).filter((i) => i.productId)
  const subtotal = items.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  )
  const deliveryCharge = deliveryChargeFor(subtotal)
  return {
    items: items.map((i) => ({
      product: i.productId,
      quantity: i.quantity,
      lineTotal: i.productId.price * i.quantity,
    })),
    subtotal,
    deliveryCharge,
    total: subtotal + deliveryCharge,
  }
}

const loadCart = (userId) =>
  Cart.findOne({ userId }).populate('items.productId')

export const getCart = async (req, res) => {
  const cart = await loadCart(req.user._id)
  res.json({ cart: cartResponse(cart) })
}

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body
  const qty = Math.max(1, Number(quantity))

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  if (product.stock < 1) return res.status(400).json({ message: 'Product is out of stock' })

  let cart = await Cart.findOne({ userId: req.user._id })
  if (!cart) cart = new Cart({ userId: req.user._id, items: [] })

  const item = cart.items.find((i) => i.productId.toString() === productId)
  const newQty = (item?.quantity || 0) + qty
  if (newQty > product.stock) {
    return res.status(400).json({ message: `Only ${product.stock} in stock` })
  }

  if (item) item.quantity = newQty
  else cart.items.push({ productId, quantity: qty })

  await cart.save()
  await cart.populate('items.productId')
  res.json({ cart: cartResponse(cart) })
}

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body
  const qty = Number(quantity)
  if (!Number.isInteger(qty) || qty < 0) {
    return res.status(400).json({ message: 'Quantity must be a non-negative integer' })
  }

  const cart = await Cart.findOne({ userId: req.user._id })
  if (!cart) return res.status(404).json({ message: 'Cart not found' })

  const item = cart.items.find(
    (i) => i.productId.toString() === req.params.productId
  )
  if (!item) return res.status(404).json({ message: 'Item not in cart' })

  if (qty === 0) {
    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== req.params.productId
    )
  } else {
    const product = await Product.findById(req.params.productId)
    if (!product || qty > product.stock) {
      return res.status(400).json({ message: `Only ${product?.stock ?? 0} in stock` })
    }
    item.quantity = qty
  }

  await cart.save()
  await cart.populate('items.productId')
  res.json({ cart: cartResponse(cart) })
}

export const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id })
  if (!cart) return res.status(404).json({ message: 'Cart not found' })

  cart.items = cart.items.filter(
    (i) => i.productId.toString() !== req.params.productId
  )
  await cart.save()
  await cart.populate('items.productId')
  res.json({ cart: cartResponse(cart) })
}
