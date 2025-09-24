import express from 'express'
import 'express-async-errors'
import 'dotenv/config'
import { errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/auth.routes.js'
import healthRoutes from './routes/health.routes.js'
import noteRoutes from './routes/note.routes.js'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/notes', noteRoutes)
app.use('/health', healthRoutes)

app.use(errorHandler)

export default app