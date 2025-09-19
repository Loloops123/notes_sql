import prisma from '../prisma.js'

export const getAllNotes = async (userId) => {
  return prisma.note.findMany({
    where: { userId }
  })
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