import { Router } from 'express'
import {
  createGift,
  getBirthdayDashboard,
  getGifts,
  getNotifications,
  getSettings,
  getUpcomingBirthdays,
  updateGiftStatus,
  updateSettings,
} from '../controllers/adminBirthdayController.js'
import { adminOnly, protect } from '../middleware/auth.js'

const router = Router()

router.use(protect, adminOnly)

router.get('/dashboard', getBirthdayDashboard)
router.get('/upcoming', getUpcomingBirthdays)
router.get('/gifts', getGifts)
router.post('/gifts', createGift)
router.patch('/gifts/:id/status', updateGiftStatus)
router.get('/notifications', getNotifications)
router.get('/settings', getSettings)
router.put('/settings', updateSettings)

export default router
