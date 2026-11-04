import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'

import User from '../models/User.js'
import Pet from '../models/Pet.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Cart from '../models/Cart.js'
import Wishlist from '../models/Wishlist.js'
import Order from '../models/Order.js'
import Review from '../models/Review.js'
import Coupon from '../models/Coupon.js'

dotenv.config()

const models = [User, Pet, Category, Product, Cart, Wishlist, Order, Review, Coupon]

const init = async () => {
  try {
    await connectDB()
    for (const model of models) {
      await model.createCollection()
      await model.syncIndexes()
      console.log(`ready: ${model.collection.name}`)
    }
    console.log('All collections created in Atlas')
  } catch (err) {
    console.error('Init failed:', err.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

init()
