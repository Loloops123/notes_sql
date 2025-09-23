import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import jwt from 'jsonwebtoken'
import { protect } from '../../../src/middleware/auth.middleware.js'
import ApiError from '../../../src/utils/ApiError.js'

describe('Auth Middleware (protect)', () => {
  let mockRequest
  let mockResponse
  let mockNext
  
  beforeEach(() => {
    // "Шпионим" за методом verify НАСТОЯЩЕГО объекта jwt
    jest.spyOn(jwt, 'verify')
    
    mockRequest = {
      headers: {}
    }
    mockResponse = {}
    mockNext = jest.fn()
  })
  
  // Важно: после каждого теста восстанавливаем оригинальный jwt.verify
  afterEach(() => {
    jest.restoreAllMocks()
  })
  
  it('должен вызывать next() и добавить userId в req, если токен валиден', () => {
    const token = 'valid_token'
    mockRequest.headers.authorization = `Bearer ${token}`
    const decodedPayload = { userId: 123 }
    
    // Теперь jwt.verify - это шпион, и мы можем управлять его поведением
    jwt.verify.mockReturnValue(decodedPayload)
    
    protect(mockRequest, mockResponse, mockNext)
    
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET)
    expect(mockRequest.userId).toBe(123)
    expect(mockNext).toHaveBeenCalledWith()
  })
  
  it('должен выбрасывать ApiError (401), если токен не предоставлен', () => {
    expect(() => {
      protect(mockRequest, mockResponse, mockNext)
    }).toThrow(new ApiError(401, 'Нет авторизации, токен не предоставлен'))
    
    expect(mockNext).not.toHaveBeenCalled()
  })
  
  it('должен выбрасывать ApiError (401), если токен недействителен', () => {
    const token = 'invalid_token'
    mockRequest.headers.authorization = `Bearer ${token}`
    
    jwt.verify.mockImplementation(() => {
      throw new Error('Verification failed')
    })
    
    expect(() => {
      protect(mockRequest, mockResponse, mockNext)
    }).toThrow(new ApiError(401, 'Нет авторизации, токен недействителен'))
    
    expect(mockNext).not.toHaveBeenCalled()
  })
})