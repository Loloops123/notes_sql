import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import {
  createNoteController
} from '../../../src/controllers/note.controller.js'

describe('Контроллер getAllNotes - Unit Test', () => {
  let mockNoteService
  let mockRedisClient
  let noteController
  let mockRequest
  let mockResponse
  let mockNext
  
  beforeEach(() => {
    // 1. Создаём фальшивые зависимости
    mockNoteService = {
      getAllNotes: jest.fn()
    }
    mockRedisClient = {
      get: jest.fn(),
      set: jest.fn()
    }
    
    // 2. "Собираем" контроллер с ФАЛЬШИВЫМИ зависимостями
    noteController = createNoteController(mockNoteService, mockRedisClient)
    
    // 3. Готовим фальшивые req и res
    mockRequest = { userId: 1, query: {} }
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    mockNext = jest.fn()
  })
  
  it('должен вернуть данные из кэша (cache hit)', async () => {
    const cachedData = { data: [{ title: 'Из кэша' }] }
    mockRedisClient.get.mockResolvedValue(JSON.stringify(cachedData))
    
    await noteController.getAllNotes(mockRequest, mockResponse)
    
    expect(mockRedisClient.get).toHaveBeenCalledTimes(1)
    expect(mockNoteService.getAllNotes).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith(cachedData)
  })
})