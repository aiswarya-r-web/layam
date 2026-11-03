import { Router } from 'express'
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
  validateCoupon,
} from '../controllers/couponController.js'
import { adminOnly, protect } from '../middleware/auth.js'

const router = Router()

router.post('/validate', protect, validateCoupon)
router.get('/', protect, adminOnly, getCoupons)
router.post('/', protect, adminOnly, createCoupon)
router.put('/:id', protect, adminOnly, updateCoupon)
router.delete('/:id', protect, adminOnly, deleteCoupon)

export default router
