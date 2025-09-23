import { beforeEach, describe, expect, it, jest } from '@jest/globals'

import logger from '../../../src/config/logger.js'
import { errorHandler } from '../../../src/middleware/errorHandler.js'
import ApiError from '../../../src/utils/ApiError.js'

describe('Middleware для обработки ошибок', () => {
  let mockRequest
  let mockResponse
  let mockNext
  
  beforeEach(() => {
    jest.spyOn(logger, 'error').mockImplementation(
      () => {
      }
    )
    
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    mockNext = jest.fn()
  })
  
  afterEach(() => {
    jest.restoreAllMocks()
  })
  
  it('должен правильно обрабатывать ApiError', () => {
    const apiError = new ApiError(404, 'Заметка не найдена')
    
    errorHandler(apiError, mockRequest, mockResponse, mockNext)
    
    expect(logger.error).toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Заметка не найдена'
    })
  })
  
  it('должен обрабатывать стандартные ошибки со статусом 500', () => {
    const genericError = new Error('Что-то сломалось!')
    
    errorHandler(genericError, mockRequest, mockResponse, mockNext)
    
    expect(logger.error).toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Произошла непредвиденная ошибка сервера.'
    })
  })
})