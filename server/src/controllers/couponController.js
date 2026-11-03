import Coupon from '../models/Coupon.js'
import { applyCoupon } from '../utils/pricing.js'

export const validateCoupon = async (req, res) => {
  const { code, orderAmount } = req.body
  if (!code) return res.status(400).json({ message: 'Coupon code is required' })

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })
  if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' })
  if (coupon.expiryDate < new Date()) {
    return res.status(400).json({ message: 'Coupon has expired' })
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ message: 'Coupon usage limit reached' })
  }
  if (Number(orderAmount) < coupon.minimumOrderAmount) {
    return res
      .status(400)
      .json({ message: `Minimum order ₹${coupon.minimumOrderAmount} required` })
  }

  res.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount: applyCoupon(coupon, Number(orderAmount)),
  })
}

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 })
  res.json({ coupons })
}

export const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body)
  res.status(201).json({ coupon })
}

export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  })
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
  res.json({ coupon })
}

export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id)
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
  res.json({ message: 'Coupon deleted' })
}
