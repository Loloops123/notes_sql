import express from 'express'
import 'express-async-errors'
import 'dotenv/config'
import { errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/auth.routers.js'
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
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
})