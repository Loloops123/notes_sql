import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
// НЕ импортируем app или userService здесь

// 1. "Мокаем" модуль до всех импортов.
// Это новый, современный синтаксис для мокирования ES-модулей.
jest.unstable_mockModule('../../../src/services/user.service.js', () => ({
  createUser: jest.fn()
}))

describe('REGISTER - Error Handling', () => {
  let app
  let userService
  let request
  
  // 2. Используем динамический import() ПОСЛЕ того, как мок был определён
  beforeEach(async () => {
    // Загружаем 'app' и 'userService' заново перед каждым тестом
    // Теперь они импортируют уже "мокнутую" версию сервиса.
    app = (await import('../../../src/app.js')).default
    userService = await import('../../../src/services/user.service.js')
    request = (await import('supertest')).default
  })
  
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('должен вернуть 500, если в сервисе произошла непредвиденная ошибка', async () => {
    const testUser = {
      email: 'test@example.com',
      password: 'Password123'
    }
    
    const errorMessage = 'Какая-то ошибка базы данных'
    // Настраиваем наш мок
    userService.createUser.mockRejectedValue(new Error(errorMessage))
    
    const response = await request(app)
      .post('/auth/register')
      .send(testUser)
      .expect(500)
    
    expect(response.body.message).toBe('Произошла непредвиденная ошибка сервера.')
    expect(userService.createUser).toHaveBeenCalled()
  })
})