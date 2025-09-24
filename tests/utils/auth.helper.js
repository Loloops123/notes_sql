import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma.js'

export const createUserAndGetToken = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: hashedPassword
    }
  })
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
  
  return { user, token }
}