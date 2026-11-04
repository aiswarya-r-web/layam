import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Product from '../models/Product.js'

const SORTS = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
  popular: { rating: -1 },
}

export const getProducts = async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    ageGroup,
    dogSize,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query

  const filter = { isActive: true }

  if (search) filter.$text = { $search: search }

  if (category) {
    const cat = mongoose.isValidObjectId(category)
      ? await Category.findById(category)
      : await Category.findOne({ slug: category })
    if (!cat) return res.status(404).json({ message: 'Category not found' })
    filter.categoryId = cat._id
  }

  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  if (ageGroup) filter.ageGroup = ageGroup
  if (dogSize) filter.dogSize = dogSize

  const pageNum = Math.max(1, Number(page))
  const pageSize = Math.min(50, Math.max(1, Number(limit)))

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .populate('categoryId', 'name slug')
      .sort(SORTS[sort] || SORTS.newest)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize),
  ])

  res.json({
    products,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize),
      limit: pageSize,
    },
  })
}

export const getProduct = async (req, res) => {
  const { id } = req.params
  const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id }
  const product = await Product.findOne({ ...query, isActive: true }).populate(
    'categoryId',
    'name slug'
  )
  if (!product) return res.status(404).json({ message: 'Product not found' })

  const related = await Product.find({
    categoryId: product.categoryId._id,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4)

  res.json({ product, related })
}

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json({ product })
}

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
}

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { returnDocument: 'after' }
  )
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ message: 'Product deactivated', product })
}
