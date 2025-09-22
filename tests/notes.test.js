import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import app from '../src/app.js'
import prisma from '../src/prisma.js'

describe('API /notes', () => {
  let testUser
  let authToken
  let testNote
  
  beforeEach(async () => {
    await prisma.note.deleteMany({})
    await prisma.user.deleteMany({})
    
    const hashedPassword = await bcrypt.hash('password', 10)
    
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword
      }
    })
    
    testNote = await prisma.note.create({
      data: {
        title: 'Test Note',
        content: 'This is a test note',
        userId: testUser.id
      }
    })
    
    authToken = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET)
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
  
  describe('GET /notes', () => {
    it('should get all notes of the user', async () => {
      const response = await request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      
      expect(response.body).toHaveLength(1)
      expect(response.body[0].title).toBe('Test Note')
      expect(response.body[0].content).toBe('This is a test note')
      expect(response.body[0].userId).toBe(testUser.id)
    })
    
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .get('/notes')
        .expect(401)
      
      expect(response.body).toEqual({
        message: 'Нет авторизации, токен не предоставлен',
        success: false
      })
    })
    
    it('should return 401 if token is invalid', async () => {
      let invalidToken = 'test_invalid_token'
      
      const response = await request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401)
      
      expect(response.body).toEqual({
        message: 'Нет авторизации, токен недействителен',
        success: false
      })
    })
  })
  
  describe('GET /notes/:id', () => {
    it('should get note by id', async () => {
      const response = await request(app)
        .get(`/notes/${testNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      
      expect(response.body.id).toBe(testNote.id)
      expect(response.body.title).toBe('Test Note')
      expect(response.body.content).toBe('This is a test note')
      expect(response.body.userId).toBe(testUser.id)
    })
    
    it('should return 404 if note is not found', async () => {
      const response = await request(app)
        .get('/notes/3')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
      
      expect(response.body).toEqual({
        message: 'Заметка не найдена',
        success: false
      })
    })
    
    it('should return 404 if this note is not acceptable of this user', async () => {
      const anotherUser = await prisma.user
        .create(
          {
            data:
              {
                email: 'another@user.com',
                password: 'password'
              }
          }
        )
      const anotherUsersNote = await prisma.note
        .create(
          {
            data:
              {
                title: 'Чужая заметка',
                userId: anotherUser.id
              }
          }
        )
      
      const response = await request(app)
        .get(`/notes/${anotherUsersNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
      
      expect(response.body).toEqual({
        message: 'Заметка не найдена',
        success: false
      })
    })
    
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .get('/notes/1')
        .expect(401)
      
      expect(response.body).toEqual({
        message: 'Нет авторизации, токен не предоставлен',
        success: false
      })
    })
    
    it('should return 401 if token is invalid', async () => {
      let invalidToken = 'test_invalid_token'
      
      const response = await request(app)
        .get('/notes/1')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401)
      
      expect(response.body).toEqual({
        message: 'Нет авторизации, токен недействителен',
        success: false
      })
    })
  })
})