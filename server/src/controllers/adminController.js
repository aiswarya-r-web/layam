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

export const getAnalytics = async (req, res) => {
  const since = new Date(Date.now() - 13 * 86400000)
  since.setHours(0, 0, 0, 0)

  const [revenueByDay, ordersByStatus, topProducts, avgAgg, paidOrders] =
    await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: since }, orderStatus: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            total: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            name: { $first: '$items.productName' },
            qty: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { qty: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, avg: { $avg: '$totalAmount' } } },
      ]),
      Order.countDocuments({ paymentStatus: 'paid' }),
    ])

  const days = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(since.getTime() + i * 86400000).toISOString().slice(0, 10)
    const found = revenueByDay.find((r) => r._id === d)
    days.push({ date: d, total: found?.total || 0, count: found?.count || 0 })
  }

  res.json({
    revenueByDay: days,
    ordersByStatus: ordersByStatus.reduce((o, s) => ({ ...o, [s._id]: s.count }), {}),
    topProducts,
    avgOrderValue: Math.round(avgAgg[0]?.avg || 0),
    paidOrders,
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
