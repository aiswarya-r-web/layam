import { Router } from 'express'
import {
  getSpinHistory,
  getSpinStatus,
  spin,
  updateSpinCampaign,
} from '../controllers/spinController.js'
import { adminOnly, protect } from '../middleware/auth.js'

const router = Router()

router.get('/status', protect, getSpinStatus)
router.post('/', protect, spin)
router.get('/admin/history', protect, adminOnly, getSpinHistory)
router.put('/admin/campaign', protect, adminOnly, updateSpinCampaign)

export default router
