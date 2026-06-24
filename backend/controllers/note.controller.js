import Note from '../models/note.model.js'
import { asynchandler } from '../utils/asynchandler.js'
import { apires } from '../utils/apires.js'
import { apierror } from '../utils/apierror.js'
// GET all notes of logged in user
import mongoose from 'mongoose'

const getNotes = asynchandler(async (req, res) => {
    const notes = await Note.find({ userId: new mongoose.Types.ObjectId(req.user._id) }).sort({ createdAt: -1 })
    return res.status(200).json(new apires(200, notes, "Notes fetched successfully"))
})

const createNote = asynchandler(async (req, res) => {
    const { topic, theory } = req.body
    if (!topic || !theory) throw new apierror(400, "Topic and theory are required")
        console.log('userId being saved:', new mongoose.Types.ObjectId(req.user._id))
    const note = await Note.create({ 
        topic, 
        theory, 
        userId: new mongoose.Types.ObjectId(req.user._id)
    })
    return res.status(200).json(new apires(200, note, "Note created successfully"))
})
// PATCH update note
const updateNote = asynchandler(async (req, res) => {
    const { topic, theory } = req.body
    const note = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { topic, theory },
        { new: true }
    )
    if (!note) throw new apierror(404, "Note not found")
    return res.status(200).json(new apires(200, note, "Note updated successfully"))
})

// DELETE note
const deleteNote = asynchandler(async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!note) throw new apierror(404, "Note not found")
    return res.status(200).json(new apires(200, {}, "Note deleted successfully"))
})

export { getNotes, createNote, updateNote, deleteNote }