import prisma from '../prisma.js'

export const getAllNotes = async (userId, options = {}) => {
  const { skip, take, orderBy } = options
  
  const [notes, totalNotes] = await prisma.$transaction([
    prisma.note.findMany({
      where: { userId },
      skip,
      take,
      orderBy
    }),
    prisma.note.count({
      where: { userId }
    })
  ])
  
  return {
    notes,
    totalNotes
  }
}

export const getNoteById = async (id, userId) => {
  return prisma.note.findUnique({
    where: { id: Number(id), userId }
  })
}

export const createNote = async (title, content, userId) => {
  return prisma.note.create({
    data: {
      title,
      content,
      userId
    }
  })
}

export const updateNote = async (id, title, content, userId) => {
  return prisma.note.update({
    where: { id: Number(id), userId },
    data: { title, content }
  })
}

export const patchNote = async (id, data, userId) => {
  return prisma.note.update({
    where: { id: Number(id), userId },
    data: { ...data }
  })
}

export const deleteNote = async (id, userId) => {
  return prisma.note.delete({
    where: { id: Number(id), userId }
  })
}