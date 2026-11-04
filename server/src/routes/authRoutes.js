import { Router } from 'express'
import { getMe, login, logout, register, updateProfile } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/me', protect, updateProfile)
router.post('/logout', protect, logout)

export default router
