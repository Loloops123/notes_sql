import prisma from '../prisma.js'

export const getAllNotes = async () => {
  return prisma.note.findMany()
}

export const getNoteById = async (id) => {
  return prisma.note.findUnique({
    where: { id: Number(id) }
  })
}

export const createNote = async (title, content) => {
  return prisma.note.create({
    data: {
      title,
      content
    }
  })
}

export const updateNote = async (id, title, content) => {
  return prisma.note.update({
    where: { id: Number(id) },
    data: { title, content }
  })
}

export const patchNote = async (id, data) => {
  return prisma.note.update({
    where: { id: Number(id) },
    data
  })
}

export const deleteNote = async (id) => {
  return prisma.note.delete({
    where: { id: Number(id) }
  })
}