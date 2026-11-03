import { Router } from 'express'
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.post('/', createOrder)
router.get('/my-orders', getMyOrders)
router.get('/:id', getOrderById)
router.patch('/:id/cancel', cancelOrder)

export default router
