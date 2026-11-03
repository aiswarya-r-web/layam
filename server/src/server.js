import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import petRoutes from './routes/petRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import birthdayRoutes from './routes/birthdayRoutes.js'
import adminBirthdayRoutes from './routes/adminBirthdayRoutes.js'
import assistantRoutes from './routes/assistantRoutes.js'
import spinRoutes from './routes/spinRoutes.js'
import { scheduleBirthdayJob } from './jobs/birthdayJob.js'

dotenv.config()

const app = express()

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Layam API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/pets', petRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/admin/birthdays', adminBirthdayRoutes)
app.use('/api/birthday', birthdayRoutes)
app.use('/api/assistant', assistantRoutes)
app.use('/api/spin', spinRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB()
      scheduleBirthdayJob()
    } else {
      console.warn('MONGODB_URI not set — starting without database connection')
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
