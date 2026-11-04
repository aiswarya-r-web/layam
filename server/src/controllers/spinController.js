import crypto from 'crypto'
import mongoose from 'mongoose'
import Coupon from '../models/Coupon.js'
import Order from '../models/Order.js'
import SpinAttempt from '../models/SpinAttempt.js'
import SpinCampaign from '../models/SpinCampaign.js'
import SpinReward from '../models/SpinReward.js'
import { DELIVERY_FEE } from '../utils/pricing.js'

const REWARD_SEED = [
  { name: '5% OFF', rewardType: 'percentage', value: 5, probability: 25 },
  { name: '₹100 OFF', rewardType: 'fixed', value: 100, probability: 18 },
  { name: 'FREE SHIPPING', rewardType: 'free_shipping', value: 0, probability: 15 },
  { name: '10% OFF', rewardType: 'percentage', value: 10, probability: 15 },
  { name: '₹150 OFF', rewardType: 'fixed', value: 150, probability: 8 },
  { name: '15% OFF', rewardType: 'percentage', value: 15, probability: 7 },
  { name: 'FREE DOG TOY', rewardType: 'free_product', value: 0, probability: 2 },
  { name: 'BETTER LUCK NEXT TIME', rewardType: 'no_win', value: 0, probability: 10 },
]

const getCampaignWithRewards = async () => {
  let campaign = await SpinCampaign.findOne({ isActive: true }).sort({ createdAt: -1 })
  if (!campaign) {
    campaign = await SpinCampaign.create({})
    await SpinReward.insertMany(
      REWARD_SEED.map((r, i) => ({ ...r, campaignId: campaign._id, sortOrder: i }))
    )
  }
  const rewards = await SpinReward.find({ campaignId: campaign._id }).sort({ sortOrder: 1 })
  return { campaign, rewards }
}

const eligibilityError = async (order, campaign, userId) => {
  if (!campaign.isActive) return 'The spin campaign is not active right now'
  const now = new Date()
  if (campaign.startDate && campaign.startDate > now) return 'The spin campaign has not started yet'
  if (campaign.endDate && campaign.endDate < now) return 'The spin campaign has ended'
  if (order.orderStatus === 'cancelled') return 'Cancelled orders are not eligible'
  if (order.orderStatus !== 'delivered') return 'Your spin unlocks once the order is delivered'
  if (order.subtotal < campaign.minimumOrderAmount) {
    return `Orders of ₹${campaign.minimumOrderAmount}+ unlock a spin`
  }
  const spins = await SpinAttempt.countDocuments({ userId, campaignId: campaign._id })
  if (spins >= campaign.maxSpinsPerCustomer) return 'You have used all your spins'
  return null
}

const genCode = async (prefix) => {
  for (let i = 0; i < 6; i++) {
    const code = `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    const used = (await Coupon.exists({ code })) || (await SpinAttempt.exists({ giftCode: code }))
    if (!used) return code
  }
  throw new Error('Could not generate a unique code')
}

export const getSpinStatus = async (req, res) => {
  const order = await Order.findOne({ _id: req.query.orderId, userId: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })

  const attempt = await SpinAttempt.findOne({ orderId: order._id })
    .populate('rewardId', 'name rewardType')
    .populate('couponId', 'code discountType discountValue expiryDate')
  if (attempt) {
    return res.json({
      eligible: false,
      attempt: {
        reward: attempt.rewardId,
        coupon: attempt.couponId,
        giftCode: attempt.giftCode,
        spunAt: attempt.spunAt,
      },
    })
  }

  const { campaign, rewards } = await getCampaignWithRewards()
  const error = await eligibilityError(order, campaign, req.user._id)
  res.json({
    eligible: !error,
    reason: error || undefined,
    minimumOrderAmount: campaign.minimumOrderAmount,
    rewards: rewards.map((r) => ({ name: r.name, rewardType: r.rewardType })),
  })
}

export const spin = async (req, res) => {
  const order = await Order.findOne({ _id: req.body.orderId, userId: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })

  const { campaign, rewards } = await getCampaignWithRewards()
  const error = await eligibilityError(order, campaign, req.user._id)
  if (error) return res.status(400).json({ message: error })

  const pickable = rewards.filter(
    (r) => r.rewardType === 'no_win' || !r.maxUsage || r.usedCount < r.maxUsage
  )
  const totalWeight = pickable.reduce((s, r) => s + r.probability, 0)
  let roll = Math.random() * totalWeight
  let reward = pickable[pickable.length - 1]
  for (const r of pickable) {
    roll -= r.probability
    if (roll <= 0) {
      reward = r
      break
    }
  }
  const segmentIndex = rewards.findIndex((r) => r._id.equals(reward._id))

  const session = await mongoose.startSession()
  try {
    let attempt
    await session.withTransaction(async () => {
      let couponId
      let giftCode
      const expiry = new Date(Date.now() + campaign.couponExpiryDays * 86400000)

      if (reward.rewardType === 'percentage' || reward.rewardType === 'fixed') {
        const [coupon] = await Coupon.create(
          [
            {
              code: await genCode('SPIN'),
              userId: req.user._id,
              discountType: reward.rewardType,
              discountValue: reward.value,
              maximumDiscount: reward.rewardType === 'percentage' ? 500 : undefined,
              minimumOrderAmount: 0,
              usageLimit: 1,
              expiryDate: expiry,
            },
          ],
          { session }
        )
        couponId = coupon._id
      } else if (reward.rewardType === 'free_shipping') {
        const [coupon] = await Coupon.create(
          [
            {
              code: await genCode('SHIP'),
              userId: req.user._id,
              discountType: 'fixed',
              discountValue: DELIVERY_FEE,
              minimumOrderAmount: 0,
              usageLimit: 1,
              expiryDate: expiry,
            },
          ],
          { session }
        )
        couponId = coupon._id
      } else if (reward.rewardType === 'free_product') {
        giftCode = await genCode('TOY')
      }

      ;[attempt] = await SpinAttempt.create(
        [
          {
            userId: req.user._id,
            orderId: order._id,
            campaignId: campaign._id,
            rewardId: reward._id,
            couponId,
            giftCode,
          },
        ],
        { session }
      )

      await SpinReward.updateOne({ _id: reward._id }, { $inc: { usedCount: 1 } }, { session })
    })

    const coupon = attempt.couponId
      ? await Coupon.findById(attempt.couponId).select('code discountType discountValue expiryDate')
      : null

    res.json({
      segmentIndex,
      reward: { name: reward.name, rewardType: reward.rewardType },
      coupon,
      giftCode: attempt.giftCode,
    })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'This order was already spun' })
    }
    res.status(500).json({ message: err.message })
  } finally {
    session.endSession()
  }
}

export const getSpinHistory = async (req, res) => {
  const attempts = await SpinAttempt.find()
    .populate('userId', 'name email')
    .populate('orderId', 'subtotal')
    .populate('rewardId', 'name rewardType')
    .populate('couponId', 'code')
    .sort({ spunAt: -1 })
    .limit(100)
  const campaign = await SpinCampaign.findOne().sort({ createdAt: -1 })
  res.json({ attempts, campaign })
}

export const updateSpinCampaign = async (req, res) => {
  const allowed = [
    'name',
    'minimumOrderAmount',
    'startDate',
    'endDate',
    'isActive',
    'maxSpinsPerCustomer',
    'couponExpiryDays',
  ]
  const updates = {}
  for (const k of allowed) {
    if (req.body[k] !== undefined) updates[k] = req.body[k]
  }
  const campaign = await SpinCampaign.findOneAndUpdate(
    {},
    { $set: updates },
    { returnDocument: 'after', sort: { createdAt: -1 } }
  )
  if (!campaign) return res.status(404).json({ message: 'No campaign found' })
  res.json({ campaign })
}
