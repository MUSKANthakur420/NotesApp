import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

export const registerUser = createAsyncThunk('auth/register', async ({ username, email, password }, { rejectWithValue }) => {
    try {
        const res = await axios.post('/users/register', { username, email, password })
        return res.data.data
    } catch(err) {
        return rejectWithValue(err.response.data.message)
    }
})

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const res = await axios.post('/users/login', { email, password })
        return res.data.data.user
    } catch(err) {
        return rejectWithValue(err.response.data.message)
    }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.post('/users/logout')
    } catch(err) {
        return rejectWithValue(err.response.data.message)
    }
})

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
        builder.addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload })
        builder.addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })

        builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
        builder.addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload })
        builder.addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })

        builder.addCase(logoutUser.fulfilled, (state) => { state.user = null })
    }
})

export default AuthSlice.reducer