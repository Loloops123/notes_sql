import { Router } from 'express'
import redisClient from '../config/redisClient.js'
import { createNoteController } from '../controllers/note.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import * as noteService from '../services/note.service.js'

const noteController = createNoteController(noteService, redisClient)

const router = Router()

router.use(protect)

router.get('/', noteController.getAllNotes)
  .post('/', noteController.createNote)

router.get('/:id', noteController.getNoteById)
  .put('/:id', noteController.updateNote)
  .patch('/:id', noteController.patchNote)
  .delete('/:id', noteController.deleteNote)

export default router