import request from 'supertest'
import app from '../../../src/app.js'
import prisma from '../../../src/prisma.js'
import { createUserAndGetToken } from '../../utils/auth.helper.js'

describe('DELETE', () => {
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
  
  describe('DELETE /notes/:id', () => {
    it('should put note by id', async () => {
      await request(app)
        .delete(`/notes/${testNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204)
    })
  })
})