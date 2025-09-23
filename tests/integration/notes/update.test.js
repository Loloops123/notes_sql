import request from 'supertest'
import app from '../../../src/app.js'
import prisma from '../../../src/prisma.js'
import { createUserAndGetToken } from '../../utils/auth.helper.js'

describe('UPDATE', () => {
  let testUser
  let authToken
  let testNote
  
  beforeEach(async () => {
    await prisma.note.deleteMany({})
    await prisma.user.deleteMany({})
    
    const { user, token } = await createUserAndGetToken()
    
    testUser = user
    authToken = token
    
    testNote = await prisma.note.create({
      data: {
        title: 'Test Note',
        content: 'This is a test note',
        userId: testUser.id
      }
    })
  })
  
  afterAll(async () => {
    await prisma.$disconnect()
  })
  
  describe('PUT /notes/:id', () => {
    it('should put note by id', async () => {
      const response = await request(app)
        .put(`/notes/${testNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'new_test_title',
          content: 'new_test_content'
        })
        .expect(200)
      
      expect(response.body.id).toBe(testNote.id)
      expect(response.body.title).toBe('new_test_title')
      expect(response.body.content).toBe('new_test_content')
      expect(response.body.userId).toBe(testUser.id)
    })
    
    it('should return 400 if one field dont completed', async () => {
      const response = await request(app)
        .put(`/notes/${testNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'new_test_content'
        })
        .expect(400)
      
      expect(response.body).toEqual({
        message: 'Для полного обновления (PUT) необходимо передать оба поля: title и content',
        success: false
      })
    })
  })
  
  describe('PATCH /notes/:id', () => {
    it('should put note by id', async () => {
      const response = await request(app)
        .patch(`/notes/${testNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'new_test_title'
        })
        .expect(200)
      
      expect(response.body.id).toBe(testNote.id)
      expect(response.body.title).toBe('new_test_title')
      expect(response.body.content).toBe(testNote.content)
      expect(response.body.userId).toBe(testUser.id)
    })
  })
})