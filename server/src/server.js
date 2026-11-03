import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Layam API is running' })
})

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB()
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
