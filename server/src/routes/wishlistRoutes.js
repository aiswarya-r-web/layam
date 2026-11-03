import { Router } from 'express'
import {
  addToWishlist,
  getWishlist,
  moveToCart,
  removeFromWishlist,
} from '../controllers/wishlistController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', getWishlist)
router.post('/:productId', addToWishlist)
router.post('/:productId/move-to-cart', moveToCart)
router.delete('/:productId', removeFromWishlist)

export default router
