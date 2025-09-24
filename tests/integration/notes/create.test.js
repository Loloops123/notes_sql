import request from 'supertest'
import app from '../../../src/app.js'
import prisma from '../../../src/prisma.js'
import { createUserAndGetToken } from '../../utils/auth.helper.js'

describe('CREATE', () => {
  let testUser
  let authToken
  
  beforeEach(async () => {
    await prisma.note.deleteMany({})
    await prisma.user.deleteMany({})
    
    const { user, token } = await createUserAndGetToken()
    
    testUser = user
    authToken = token
  })
  
  afterAll(async () => {
    await prisma.$disconnect()
  })
  
  describe('POST /notes', () => {
    const noteData = {
      title: 'Test Note',
      content: 'This is a test note'
    }
    
    it('should create a new note', async () => {
      const response = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(noteData)
        .expect(201)
      
      expect(response.body.title).toBe(noteData.title)
      expect(response.body.content).toBe(noteData.content)
      expect(response.body.userId).toBe(testUser.id)
      
      const noteInDB = await prisma.note.findUnique({
        where: {
          id: response.body.id
        }
      })
      
      expect(noteInDB).not.toBeNull()
      expect(noteInDB.title).toBe(noteData.title)
    })
    
    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a test note'
        })
        .expect(400)
      
      expect(response.body).toEqual({
        message: 'Title обязателен',
        success: false
      })
    })
    
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .post('/notes')
        .send({
          title: 'Test Note'
        })
        .expect(401)
      
      expect(response.body).toEqual({
        message: 'Нет авторизации, токен не предоставлен',
        success: false
      })
    })
    
    it('should return 401 if token is invalid', async () => {
      let invalidToken = 'test_invalid_token'
      
      const response = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(noteData)
        .expect(401)
      
      expect(response.body).toEqual({
        message: 'Нет авторизации, токен недействителен',
        success: false
      })
    })
  })
})