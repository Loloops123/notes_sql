import ApiError from '../utils/ApiError.js'
import { invalidateNotesCache } from '../utils/cache.helper.js'

export const createNoteController = (noteService, redisClient) => ({
  getAllNotes: async (req, res) => {
    const { userId } = req
    const queryParams = req.query
    
    const cacheKey = `notes:${userId}:${JSON.stringify(queryParams)}`
    
    const cachedNotes = await redisClient.get(cacheKey)
    
    if (cachedNotes) {
      return res.status(200).json(JSON.parse(cachedNotes))
    }
    
    const page = parseInt(queryParams.page) || 1
    const limit = parseInt(queryParams.limit) || 10
    const sortBy = queryParams.sortBy || 'createdAt'
    const order = queryParams.order || 'desc'
    
    const skip = (page - 1) * limit
    
    const options = {
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order
      }
    }
    
    const { notes, totalNotes } = await noteService.getAllNotes(userId, options)
    const totalPages = Math.ceil(totalNotes / limit)
    
    const response = {
      data: notes,
      meta: {
        totalNotes,
        totalPages,
        currentPage: page,
        limit
      }
    }
    
    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 3600
    })
    
    res.status(200).json(response)
  },
  getNoteById: async (req, res) => {
    const { userId } = req
    const note = await noteService.getNoteById(req.params.id, userId)
    
    if (!note) {
      throw new ApiError(404, 'Заметка не найдена')
    }
    
    res.status(200).json(note)
  },
  createNote: async (req, res) => {
    const { userId } = req
    const { title, content } = req.body
    
    if (!title) {
      throw new ApiError(400, 'Title обязателен')
    }
    
    const newNote = await noteService.createNote(title, content, userId)
    
    await invalidateNotesCache(redisClient, userId)
    
    res.status(201).json(newNote)
  },
  updateNote: async (req, res) => {
    const { userId } = req
    const { id } = req.params
    const { title, content } = req.body
    
    if (typeof title === 'undefined' || typeof content === 'undefined') {
      throw new ApiError(400, 'Для полного обновления (PUT) необходимо передать оба поля: title и content')
    }
    
    const updatedNote = await noteService.updateNote(id, title, content, userId)
    
    await invalidateNotesCache(redisClient, userId)
    
    res.status(200).json(updatedNote)
  },
  patchNote: async (req, res) => {
    const { userId } = req
    const { id } = req.params
    const updatedNote = await noteService.patchNote(id, req.body, userId)
    
    await invalidateNotesCache(redisClient, userId)
    
    res.status(200).json(updatedNote)
  },
  deleteNote: async (req, res) => {
    const { userId } = req
    const { id } = req.params
    await noteService.deleteNote(id, userId)
    
    await invalidateNotesCache(redisClient, userId)
    
    res.status(204).send()
  }
})