import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

// ── Thunks ──────────────────────────────────────

export const fetchNotes = createAsyncThunk('notes/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/notes')
        return res.data.data
    } catch(err) {
        return rejectWithValue(err.response.data.message)
    }
})

export const createNote = createAsyncThunk('notes/create', async ({ topic, theory }, { rejectWithValue }) => {
    try {
        const res = await axios.post('/notes', { topic, theory })
        return res.data.data
    } catch(err) {
        return rejectWithValue(err.response.data.message)
    }
})

export const updateNote = createAsyncThunk('notes/update', async ({ id, topic, theory }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`/notes/${id}`, { topic, theory })
        return res.data.data
    } catch(err) {
        return rejectWithValue(err.response.data.message)
    }
})

export const deleteNote = createAsyncThunk('notes/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/notes/${id}`)
        return id
    } catch(err) {
        return rejectWithValue(err.response.data.message)
    }
})

// ── Slice ────────────────────────────────────────

const NotesSlice = createSlice({
    name: 'Note',
    initialState: {
        Notes: [],
        edit: null,
        search: '',
        loading: false,
        error: null
    },
    reducers: {
        editNotes: (state, action) => { state.edit = action.payload },
        searchNotes: (state, action) => { state.search = action.payload }
    },
    extraReducers: (builder) => {
        // fetch
        builder.addCase(fetchNotes.pending, (state) => { state.loading = true; state.error = null })
        builder.addCase(fetchNotes.fulfilled, (state, action) => { state.loading = false; state.Notes = action.payload })
        builder.addCase(fetchNotes.rejected, (state, action) => { state.loading = false; state.error = action.payload })

        // create
        builder.addCase(createNote.fulfilled, (state, action) => { state.Notes.unshift(action.payload) })
        builder.addCase(createNote.rejected, (state, action) => { state.error = action.payload })

        // update
        builder.addCase(updateNote.fulfilled, (state, action) => {
            state.Notes = state.Notes.map(n => n._id === action.payload._id ? action.payload : n)
            state.edit = null
        })
        builder.addCase(updateNote.rejected, (state, action) => { state.error = action.payload })

        // delete
        builder.addCase(deleteNote.fulfilled, (state, action) => {
            state.Notes = state.Notes.filter(n => n._id !== action.payload)
        })
        builder.addCase(deleteNote.rejected, (state, action) => { state.error = action.payload })
    }
})

export const { editNotes, searchNotes } = NotesSlice.actions
export default NotesSlice.reducer