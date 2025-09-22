import express from 'express'
import 'express-async-errors'
import 'dotenv/config'
import logger from './config/logger.js'
import { errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/auth.routes.js'
import noteRoutes from './routes/note.routes.js'
import healthRoutes from './routes/ping.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/notes', noteRoutes)
app.use('/health', healthRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`🚀 Сервер запущен на http://localhost:${PORT}`)
})