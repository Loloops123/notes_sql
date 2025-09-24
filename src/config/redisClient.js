import { createClient } from 'redis'
import logger from './logger.js'

const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.on('error', (err) => logger.error('Redis Client Error', err))

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect()
    logger.info('✅ Успешное подключение к Redis')
  }
}

export default redisClient