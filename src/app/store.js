import { configureStore } from '@reduxjs/toolkit'
import NotesReducer from '../features/Notes/NotesSlice'
import AuthReducer from '../features/Auth/AuthSlice'

export const store = configureStore({
    reducer: {
        Notes: NotesReducer,
        auth: AuthReducer
    }
})