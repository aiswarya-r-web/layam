import { Router } from 'express'
import { getMyNotifications, getUpcoming } from '../controllers/birthdayController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/upcoming', getUpcoming)
router.get('/notifications', getMyNotifications)

export default router
