import { Router } from 'express'
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/note.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'

const noteRouter = Router()

// all routes protected
noteRouter.use(verifyJWT)

noteRouter.route('/').get(getNotes).post(createNote)
noteRouter.route('/:id').patch(updateNote).delete(deleteNote)

export default noteRouter