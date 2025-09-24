import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import * as userService from '../services/user.service.js'

export const register = async (req, res) => {
  const { email, password } = req.body
  
  try {
    const newUser = await userService.createUser(email, password)
    
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
    
    res.status(201).json(userResponse)
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' })
    }
    
    throw err
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  
  const user = await userService.findUserByEmail(email)
  
  if (!user) {
    return res.status(401).json({ message: 'Неверные учётные данные' })
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Неверные учётные данные' })
  }
  
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  
  res.status(200).json({
    message: 'Вход выполнен успешно',
    token
  })
}