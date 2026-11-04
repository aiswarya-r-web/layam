import Wishlist from '../models/Wishlist.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
    'products.productId'
  )
  res.json({
    products: (wishlist?.products || [])
      .filter((p) => p.productId)
      .map((p) => ({ product: p.productId, addedAt: p.addedAt })),
  })
}

export const addToWishlist = async (req, res) => {
  const { productId } = req.params

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) return res.status(404).json({ message: 'Product not found' })

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user._id, 'products.productId': { $ne: productId } },
    { $push: { products: { productId } } },
    { returnDocument: 'after', upsert: true }
  ).populate('products.productId')

  res.json({
    products: wishlist.products.map((p) => ({
      product: p.productId,
      addedAt: p.addedAt,
    })),
  })
}

export const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { products: { productId: req.params.productId } } },
    { returnDocument: 'after' }
  )
  if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' })

  await wishlist.populate('products.productId')
  res.json({
    products: wishlist.products
      .filter((p) => p.productId)
      .map((p) => ({ product: p.productId, addedAt: p.addedAt })),
  })
}

export const moveToCart = async (req, res) => {
  const { productId } = req.params

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  if (product.stock < 1) return res.status(400).json({ message: 'Product is out of stock' })

  let cart = await Cart.findOne({ userId: req.user._id })
  if (!cart) cart = new Cart({ userId: req.user._id, items: [] })

  const item = cart.items.find((i) => i.productId.toString() === productId)
  if (item) {
    if (item.quantity + 1 > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} in stock` })
    }
    item.quantity += 1
  } else {
    cart.items.push({ productId, quantity: 1 })
  }
  await cart.save()

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { products: { productId } } },
    { returnDocument: 'after' }
  )
  await wishlist?.populate('products.productId')

  res.json({
    message: 'Moved to cart',
    products: (wishlist?.products || [])
      .filter((p) => p.productId)
      .map((p) => ({ product: p.productId, addedAt: p.addedAt })),
  })
}
