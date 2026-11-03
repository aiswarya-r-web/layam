import mongoose from 'mongoose'
import BirthdayGift from '../models/BirthdayGift.js'
import BirthdayNotification from '../models/BirthdayNotification.js'
import BirthdaySetting from '../models/BirthdaySetting.js'
import Order from '../models/Order.js'
import Pet from '../models/Pet.js'
import Product from '../models/Product.js'
import { daysUntilBirthday, nextBirthdayDate, nextBirthdayYear } from '../utils/birthday.js'

const STATUS_FLOW = ['PENDING', 'APPROVED', 'PACKED', 'DISPATCHED', 'DELIVERED', 'CANCELLED']

const buildUpcomingList = async () => {
  const pets = await Pet.find({ dateOfBirth: { $exists: true, $ne: null } })
    .populate('userId', 'name email phone addresses marketingOptOut')
    .sort({ dateOfBirth: 1 })

  const now = new Date()
  const settings = await BirthdaySetting.get()

  // order counts per user
  const orderCounts = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
  ])
  const countMap = Object.fromEntries(orderCounts.map((o) => [String(o._id), o.count]))

  const gifts = await BirthdayGift.find({
    birthdayYear: { $in: pets.map((p) => nextBirthdayYear(p.dateOfBirth, now)) },
  })
  const giftMap = {}
  for (const g of gifts) giftMap[`${g.petId}-${g.birthdayYear}`] = g

  return pets
    .filter((p) => p.userId)
    .map((p) => {
      const year = nextBirthdayYear(p.dateOfBirth, now)
      const orders = countMap[String(p.userId._id)] || 0
      const gift = giftMap[`${p._id}-${year}`] || null
      return {
        pet: {
          _id: p._id,
          name: p.name,
          breed: p.breed,
          dateOfBirth: p.dateOfBirth,
          nextBirthday: nextBirthdayDate(p.dateOfBirth, now),
        },
        owner: {
          _id: p.userId._id,
          name: p.userId.name,
          email: p.userId.email,
          phone: p.userId.phone,
          marketingOptOut: p.userId.marketingOptOut,
        },
        daysUntil: daysUntilBirthday(p.dateOfBirth, now),
        ordersCount: orders,
        eligible: orders >= settings.minOrdersForGift,
        gift,
      }
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

export const getBirthdayDashboard = async (req, res) => {
  const list = await buildUpcomingList()
  const now = new Date()
  const month = now.getUTCMonth()

  const [giftStats] = await BirthdayGift.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]).then((rows) => [Object.fromEntries(rows.map((r) => [r._id, r.count]))])

  res.json({
    totalPetBirthdays: list.length,
    thisMonth: list.filter((p) => new Date(p.pet.nextBirthday).getUTCMonth() === month).length,
    next10Days: list.filter((p) => p.daysUntil <= 10).length,
    giftsPending: giftStats.PENDING || 0,
    giftsDispatched: giftStats.DISPATCHED || 0,
    giftsDelivered: giftStats.DELIVERED || 0,
  })
}

export const getUpcomingBirthdays = async (req, res) => {
  const { filter = 'tendays' } = req.query
  const list = await buildUpcomingList()

  const RANGES = {
    today: (d) => d === 0,
    week: (d) => d <= 7,
    tendays: (d) => d <= 10,
    month: () => true,
  }

  let result = list
  if (RANGES[filter]) {
    result = filter === 'month'
      ? list.filter((p) => new Date(p.pet.nextBirthday).getUTCMonth() === new Date().getUTCMonth())
      : list.filter((p) => RANGES[filter](p.daysUntil))
  } else if (['PENDING', 'DISPATCHED', 'DELIVERED', 'APPROVED', 'PACKED'].includes(filter)) {
    result = list.filter((p) => p.gift?.status === filter)
  }

  res.json({ birthdays: result })
}

export const createGift = async (req, res) => {
  const { petId, items = [], giftMessage } = req.body
  if (!petId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'petId and at least one gift item are required' })
  }

  const pet = await Pet.findById(petId).populate('userId', 'addresses')
  if (!pet) return res.status(404).json({ message: 'Pet not found' })

  const session = await mongoose.startSession()
  try {
    let gift
    await session.withTransaction(async () => {
      const giftItems = []
      let total = 0
      for (const item of items) {
        const qty = Math.max(1, Number(item.quantity) || 1)
        const product = await Product.findOneAndUpdate(
          { _id: item.productId, isActive: true, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { session, new: true }
        )
        if (!product) throw new Error(`Insufficient stock for a gift item`)
        giftItems.push({
          productId: product._id,
          productName: product.name,
          quantity: qty,
          unitPrice: product.price,
        })
        total += product.price * qty
      }

      const defaultAddr = pet.userId.addresses?.find((a) => a.isDefault) || pet.userId.addresses?.[0]
      const address = defaultAddr
        ? `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.postalCode}`
        : ''

      ;[gift] = await BirthdayGift.create(
        [
          {
            petId: pet._id,
            userId: pet.userId._id,
            adminId: req.user._id,
            birthdayYear: nextBirthdayYear(pet.dateOfBirth),
            items: giftItems,
            totalAmount: total,
            giftMessage: giftMessage || (await BirthdaySetting.get()).defaultGiftMessage,
            'shipment.shippingAddress': address,
          },
        ],
        { session }
      )
    })
    res.status(201).json({ gift })
  } catch (err) {
    res.status(err.code === 11000 ? 409 : 400).json({ message: err.message })
  } finally {
    session.endSession()
  }
}

export const updateGiftStatus = async (req, res) => {
  const { status, courierName, trackingNumber } = req.body
  if (!STATUS_FLOW.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${STATUS_FLOW.join(', ')}` })
  }
  const gift = await BirthdayGift.findById(req.params.id)
  if (!gift) return res.status(404).json({ message: 'Gift not found' })

  if (status === 'DISPATCHED' && !courierName && !gift.shipment?.courierName) {
    return res.status(400).json({ message: 'Courier name is required to dispatch' })
  }

  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      if (status === 'CANCELLED' && gift.status !== 'CANCELLED') {
        for (const item of gift.items) {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.quantity } },
            { session }
          )
        }
      }
      if (courierName) gift.shipment.courierName = courierName
      if (trackingNumber) gift.shipment.trackingNumber = trackingNumber
      if (status === 'DISPATCHED') gift.shipment.dispatchedAt = new Date()
      if (status === 'DELIVERED') gift.shipment.deliveredAt = new Date()
      gift.status = status
      await gift.save({ session })
    })
    res.json({ gift })
  } finally {
    session.endSession()
  }
}

export const getGifts = async (req, res) => {
  const gifts = await BirthdayGift.find()
    .populate('petId', 'name breed')
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 })
  res.json({ gifts })
}

export const getSettings = async (req, res) => {
  res.json({ settings: await BirthdaySetting.get() })
}

export const updateSettings = async (req, res) => {
  const settings = await BirthdaySetting.findOneAndUpdate(
    { key: 'main' },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true, returnDocument: 'after' }
  )
  res.json({ settings })
}

export const getNotifications = async (req, res) => {
  const notifications = await BirthdayNotification.find()
    .populate('petId', 'name')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(100)
  res.json({ notifications })
}
