import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'

const recalcRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { productId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  await Product.updateOne(
    { _id: productId },
    {
      rating: stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0,
      reviewCount: stats[0]?.count || 0,
    }
  )
}

export const createReview = async (req, res) => {
  const { productId } = req.params
  const { rating, comment, images = [] } = req.body

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' })
  }

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) return res.status(404).json({ message: 'Product not found' })

  const existing = await Review.findOne({ userId: req.user._id, productId })
  if (existing) {
    return res.status(409).json({ message: 'You already reviewed this product' })
  }

  const purchased = await Order.exists({
    userId: req.user._id,
    'items.productId': productId,
    orderStatus: { $ne: 'cancelled' },
  })

  const review = await Review.create({
    userId: req.user._id,
    productId,
    rating,
    comment,
    images,
    isVerifiedPurchase: Boolean(purchased),
  })
  await recalcRating(product._id)

  res.status(201).json({ review })
}

export const getProductReviews = async (req, res) => {
  const { productId } = req.params
  const reviews = await Review.find({ productId })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
  res.json({ reviews })
}
