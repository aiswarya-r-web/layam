import { Router } from 'express'
import { verifySession } from '../controllers/stripeController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/verify', protect, verifySession)

export default router
