import { Router } from 'express'
import {
  createPet,
  deletePet,
  getPet,
  getPets,
  updatePet,
} from '../controllers/petController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.post('/', createPet)
router.get('/', getPets)
router.get('/:id', getPet)
router.put('/:id', updatePet)
router.delete('/:id', deletePet)

export default router
