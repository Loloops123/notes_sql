import * as noteService from '../services/note.service.js'

export const getAllNotes = async (req, res) => {
  const { userId } = req
  const notes = await noteService.getAllNotes(userId)
  
  res.json(notes)
}

export const getNoteById = async (req, res) => {
  const { userId } = req
  const note = await noteService.getNoteById(req.params.id, userId)
  
  if (!note) {
    return res.status(404).json({ message: 'Заметка не найдена' })
  }
  
  res.json(note)
}

export const createNote = async (req, res) => {
  const { userId } = req
  const { title, content } = req.body
  
  if (!title) {
    return res.status(400).json({ message: 'Title обязателен' })
  }
  
  const newNote = await noteService.createNote(title, content, userId)
  
  res.status(201).json(newNote)
}

export const updateNote = async (req, res) => {
  const { userId } = req
  const { id } = req.params
  const { title, content } = req.body
  
  if (typeof title === 'undefined' || typeof content === 'undefined') {
    return res.status(400).json({
      message: 'Для полного обновления (PUT) необходимо передать оба поля: title и content'
    })
  }
  
  const updatedNote = await noteService.updateNote(id, title, content, userId)
  
  res.json(updatedNote)
}

export const patchNote = async (req, res) => {
  const { userId } = req
  const { id } = req.params
  const updatedNote = await noteService.patchNote(id, req.body, userId)
  
  res.json(updatedNote)
}

export const deleteNote = async (req, res) => {
  const { userId } = req
  const { id } = req.params
  await noteService.deleteNote(id, userId)
  
  res.status(204).send()
}