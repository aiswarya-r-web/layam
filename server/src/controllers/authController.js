import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  addresses: user.addresses,
  createdAt: user.createdAt,
})

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  const exists = await User.findOne({ email: email.toLowerCase() })
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed, phone })

  res.status(201).json({ token: generateToken(user), user: sanitize(user) })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  res.json({ token: generateToken(user), user: sanitize(user) })
}

export const getMe = async (req, res) => {
  res.json({ user: sanitize(req.user) })
}

export const updateProfile = async (req, res) => {
  const { name, phone, currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')
  if (!user) return res.status(404).json({ message: 'User not found' })

  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ message: 'Name cannot be empty' })
    user.name = name.trim()
  }
  if (phone !== undefined) user.phone = phone.trim()

  if (newPassword) {
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' })
    }
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    user.password = await bcrypt.hash(newPassword, 10)
  }

  await user.save()
  res.json({ user: sanitize(user) })
}

export const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' })
}
