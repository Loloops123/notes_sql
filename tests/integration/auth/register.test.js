import { beforeEach, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import app from '../../../src/app.js'
import prisma from '../../../src/prisma.js'

describe('REGISTER', () => {
  let testUser = {
    email: 'test@example.com',
    password: 'JEF1ibk41'
  }
  
  beforeEach(async () => {
    await prisma.note.deleteMany({})
    await prisma.user.deleteMany({})
  })
  
  it('should register user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(testUser)
      .expect(201)
    
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body.email).toBe(testUser.email)
  })
  
  it('should return 409 if user already exists', async () => {
    await request(app)
      .post('/auth/register')
      .send(testUser)
    
    const response = await request(app)
      .post('/auth/register')
      .send(testUser)
      .expect(409)
    
    expect(response.body).toEqual(
      {
        message: 'Пользователь с таким email уже существует'
      }
    )
  })
  
  it('should return 400 email is required', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        password: testUser.password
      })
      .expect(400)
    
    expect(response.body).toEqual(
      {
        message: '"email" is required'
      }
    )
  })
  
  it('should return 400 password validate length', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        ...testUser,
        password: 'test'
      })
      .expect(400)
    
    expect(response.body).toEqual(
      {
        message: 'Пароль должен быть не короче 8 символов'
      }
    )
  })
  
  it('should return 400 password validate pattern', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        ...testUser,
        password: '123456789'
      })
      .expect(400)
    
    expect(response.body).toEqual(
      {
        message: 'Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру'
      }
    )
  })
})