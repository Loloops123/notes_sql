import { Router } from 'express'
import * as noteController from '../controllers/note.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.use(protect)

router.get('/', noteController.getAllNotes)
  .post('/', noteController.createNote)

router.get('/:id', noteController.getNoteById)
  .put('/:id', noteController.updateNote)
  .patch('/:id', noteController.patchNote)
  .delete('/:id', noteController.deleteNote)

export default router