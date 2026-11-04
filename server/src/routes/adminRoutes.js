import { Router } from 'express'
import {
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getAnalytics,
  getDashboard,
  updateOrderStatus,
} from '../controllers/adminController.js'
import { adminOnly, protect } from '../middleware/auth.js'

const router = Router()

router.use(protect, adminOnly)

router.get('/dashboard', getDashboard)
router.get('/analytics', getAnalytics)
router.get('/orders', getAllOrders)
router.patch('/orders/:id/status', updateOrderStatus)
router.get('/users', getAllUsers)
router.get('/products', getAllProducts)

export default router
