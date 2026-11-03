import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' })
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Not authorized, token invalid' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next()
  res.status(403).json({ message: 'Admin access required' })
}
