import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { categories, products } from './seedData.js'

dotenv.config()

const seed = async () => {
  try {
    await connectDB()

    // Upsert categories by slug — safe to re-run
    const categoryMap = {}
    for (const cat of categories) {
      const doc = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $set: cat },
        { returnDocument: 'after', upsert: true }
      )
      categoryMap[cat.slug] = doc._id
    }
    console.log(`Categories ready: ${categories.length}`)

    // Upsert products by slug
    let count = 0
    for (const p of products) {
      const { category, ...fields } = p
      await Product.findOneAndUpdate(
        { slug: p.slug },
        { $set: { ...fields, categoryId: categoryMap[category] } },
        { returnDocument: 'after', upsert: true, runValidators: true }
      )
      count++
    }
    console.log(`Products ready: ${count}`)

    // Provision an admin account from env vars (never hardcoded)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      await User.findOneAndUpdate(
        { email: process.env.ADMIN_EMAIL.toLowerCase() },
        {
          $set: {
            name: process.env.ADMIN_NAME || 'Admin',
            password: hashed,
            role: 'admin',
          },
        },
        { returnDocument: 'after', upsert: true }
      )
      console.log(`Admin provisioned: ${process.env.ADMIN_EMAIL}`)
    } else {
      console.log('No ADMIN_EMAIL/ADMIN_PASSWORD set — skipping admin creation')
    }

    console.log('Seed complete')
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seed()
