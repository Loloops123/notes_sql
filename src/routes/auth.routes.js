import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { registerSchema } from '../validations/auth.validation.js'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', authController.login)

export default router