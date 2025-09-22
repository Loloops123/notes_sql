import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import app from '../src/app.js'
import prisma from '../src/prisma.js'

describe('API /notes', () => {
  let testUser
  let authToken
  
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
    
    authToken = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET)
  })
  
  afterAll(async () => {
    await prisma.$disconnect()
  })
  
  describe('POST /notes', () => {
    it('should create a new note', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note'
      }
      
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
    
    it('should return 401 if user is not authenticated', async () => {
      await request(app)
        .post('/notes')
        .send({
          title: 'Test Note'
        })
        .expect(401)
    })
  })
})