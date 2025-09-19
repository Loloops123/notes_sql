import * as noteService from '../services/note.service.js'

export const getAllNotes = async (req, res) => {
  const notes = await noteService.getAllNotes()
  
  res.json(notes)
}

export const getNoteById = async (req, res) => {
  const note = await noteService.getNoteById(req.params.id)
  
  if (!note) {
    return res.status(404).json({ message: 'Заметка не найдена' })
  }
  
  res.json(note)
}

export const createNote = async (req, res) => {
  const { title, content } = req.body
  
  if (!title) {
    return res.status(400).json({ message: 'Title обязателен' })
  }
  
  const newNote = await noteService.createNote(title, content)
  
  res.status(201).json(newNote)
}

export const updateNote = async (req, res) => {
  const { id } = req.params
  const { title, content } = req.body
  
  if (typeof title === 'undefined' || typeof content === 'undefined') {
    return res.status(400).json({
      message: 'Для полного обновления (PUT) необходимо передать оба поля: title и content'
    })
  }
  
  const updatedNote = await noteService.updateNote(id, title, content)
  
  res.json(updatedNote)
}

export const patchNote = async (req, res) => {
  const { id } = req.params
  const updatedNote = await noteService.patchNote(id, req.body)
  
  res.json(updatedNote)
}

export const deleteNote = async (req, res) => {
  const { id } = req.params
  await noteService.deleteNote(id)
  
  res.status(204).send()
}