import prisma from '../../src/prisma.js'

export const createNote = async (userId) => {
  return await prisma.note.create({
    data: {
      title: 'Test Note',
      content: 'This is a test note',
      userId
    }
  })
}