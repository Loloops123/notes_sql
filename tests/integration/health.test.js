import { afterEach, describe, expect, it, jest } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'
import prisma from '../../src/prisma.js'

describe('HEALTH', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  
  describe('GET /health/ping', () => {
    it('должен вернуть 200 OK, если подключение к базе данных успешно', async () => {
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(true)
      
      const response = await request(app)
        .get('/health/ping')
        .expect(200)
      
      expect(response.body).toEqual({ status: 'ok' })
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    })
    
    it('должен вернуть 500 Error, если подключение к базе данных не удалось', async () => {
      const dbError = new Error('Ошибка подключения к БД')
      
      jest.spyOn(prisma, '$queryRaw').mockRejectedValue(dbError)
      
      const response = await request(app)
        .get('/health/ping')
        .expect(500)
      
      expect(response.body).toEqual({ status: 'error' })
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    })
  })
})