import bcrypt from 'bcrypt'

import prisma from '../prisma.js'

export const createUser = async (email, password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  })
}

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  })
}