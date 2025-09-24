import { afterAll, beforeEach, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import app from '../../../src/app.js'
import prisma from '../../../src/prisma.js'
import { createUserAndGetToken } from '../../utils/auth.helper.js'

describe('READ', () => {
  let testUser
  let authToken
  let testNote
  
  beforeEach(async () => {
    await prisma.note.deleteMany({})
    await prisma.user.deleteMany({})
    
    const { user, token } = await createUserAndGetToken()
    
    testUser = user
    authToken = token
    
    await prisma.note.createMany({
      data: [
        {
          title: 'Note 1',
          userId: testUser.id,
          createdAt: new Date('2025-01-01T10:00:00Z')
        },
        {
          title: 'Note 2',
          userId: testUser.id,
          createdAt: new Date('2025-01-01T11:00:00Z')
        },
        {
          title: 'Note 3',
          userId: testUser.id,
          createdAt: new Date('2025-01-01T12:00:00Z')
        },
        {
          title: 'Note 4',
          userId: testUser.id,
          createdAt: new Date('2025-01-01T13:00:00Z')
        },
        {
          title: 'Note 5',
          userId: testUser.id,
          createdAt: new Date('2025-01-01T14:00:00Z')
        }
      ]
    })
    
    testNote = await prisma.note.findFirst({
      where: {
        userId: testUser.id
      }
    })
  })
  
  afterAll(async () => {
    await prisma.$disconnect()
  })
  
  describe('GET /notes', () => {
    it('should get all notes', async () => {
      const response = await request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('meta')
      
      expect(response.body.data).toHaveLength(5)
      expect(response.body.data[0].title).toBe('Note 5')
      
      const { meta } = response.body
      
      expect(meta.totalNotes).toBe(5)
      expect(meta.totalPages).toBe(1)
      expect(meta.currentPage).toBe(1)
      expect(meta.limit).toBe(10)
    })
  })
  
  describe('GET /notes/:id', () => {
    it('should get note by id', async () => {
      const response = await request(app)
        .get(`/notes/${testNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      
      expect(response.body.id).toBe(testNote.id)
      expect(response.body.title).toBe('Note 1')
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