import { afterAll, beforeAll } from '@jest/globals'
import redisClient, { connectRedis } from '../../src/config/redisClient.js'

beforeAll(async () => {
  await connectRedis()
})

afterAll(async () => {
  await redisClient.quit()
})