import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export const getDashboard = async (req, res) => {
  const [revenueAgg, totalOrders, totalCustomers, totalProducts, lowStock, recentOrders] =
    await Promise.all([
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Product.find({ isActive: true, stock: { $lt: 5 } }).select('name stock'),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
    ])

  res.json({
    totalRevenue: revenueAgg[0]?.total || 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    lowStock,
    recentOrders,
  })
}

export const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  const filter = status ? { orderStatus: status } : {}
  const pageNum = Math.max(1, Number(page))
  const pageSize = Math.min(100, Math.max(1, Number(limit)))

  const [total, orders] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize),
  ])

  res.json({ orders, pagination: { total, page: pageNum, pages: Math.ceil(total / pageSize) } })
}

export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body
  if (!VALID_STATUSES.includes(orderStatus)) {
    return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` })
  }

  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })

  order.orderStatus = orderStatus
  if (orderStatus === 'delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid'
  }
  await order.save()

  res.json({ order })
}

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('name email phone role createdAt').sort({ createdAt: -1 })
  res.json({ users })
}

export const getAllProducts = async (req, res) => {
  const products = await Product.find()
    .populate('categoryId', 'name slug')
    .sort({ createdAt: -1 })
  res.json({ products })
}
