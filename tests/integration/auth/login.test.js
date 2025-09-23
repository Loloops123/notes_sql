import { beforeEach, describe, expect, it } from '@jest/globals'
import bcrypt from 'bcrypt'
import request from 'supertest'
import app from '../../../src/app.js'
import prisma from '../../../src/prisma.js'

describe('REGISTER', () => {
  let testLoginData = {
    email: 'test@example.com',
    password: 'test_login_password'
  }
  let testUser
  
  beforeEach(async () => {
    await prisma.note.deleteMany({})
    await prisma.user.deleteMany({})
    
    const hashedPassword = await bcrypt.hash('test_login_password', 10)
    
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword
      }
    })
  })
  
  it('should login user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send(testLoginData)
      .expect(200)
    
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Вход выполнен успешно')
  })
  
  it('should return 401 if user not found', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test_NOTFOUND@example.com',
        password: 'password123'
      })
      .expect(401)
    
    expect(response.body).toEqual(
      {
        message: 'Неверные учётные данные'
      }
    )
  })
  
  it('should return 401 if invalid password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        ...testLoginData,
        password: 'invalidPassword'
      })
      .expect(401)
    
    expect(response.body).toEqual(
      {
        message: 'Неверные учётные данные'
      }
    )
  })
})