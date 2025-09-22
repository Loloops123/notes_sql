import request from 'supertest'
import app from '../src/app.js'

describe('GET /health', () => {
  it('GET /ping should return 200', async () => {
    const response = await request(app)
      .get('/health/ping')
      .expect(200)
      .expect('Content-Type', /json/)
    
    expect(response.body).toEqual({ status: 'ok' })
  })
})