import app from './app.js'
import logger from './config/logger.js'
import { connectRedis } from './config/redisClient.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  await connectRedis()
  logger.info(`🚀 Сервер запущен на http://localhost:${PORT}`)
})