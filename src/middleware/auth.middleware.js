import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js'

export const protect = (req, res, next) => {
  let token
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  
  if (!token) {
    throw new ApiError(401, 'Нет авторизации, токен не предоставлен')
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    req.userId = decoded.userId
    
    next()
  } catch (err) {
    throw new ApiError(401, 'Нет авторизации, токен недействителен')
  }
}