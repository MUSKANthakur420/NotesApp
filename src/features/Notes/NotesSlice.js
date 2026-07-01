import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Fetch all notes
export const fetchNotes = createAsyncThunk(
  "notes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/v1/notes");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notes");
    }
  }
);

// Create note
export const createNote = createAsyncThunk(
  "notes/create",
  async ({ topic, theory }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/v1/notes", { topic, theory });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create note");
    }
  }
);

// Update note
export const updateNote = createAsyncThunk(
  "notes/update",
  async ({ id, topic, theory }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/v1/notes/${id}`, {
        topic,
        theory,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update note");
    }
  }
);

// Delete note
export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/notes/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete note");
    }
  }
);

const NotesSlice = createSlice({
  name: "Note",
  initialState: {
    Notes: [],
    edit: null,
    search: "",
    loading: false,
    error: null,
  },
  reducers: {
    editNotes: (state, action) => {
      state.edit = action.payload;
    },
    searchNotes: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.Notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createNote.fulfilled, (state, action) => {
        state.Notes.unshift(action.payload);
      })

      .addCase(updateNote.fulfilled, (state, action) => {
        state.Notes = state.Notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        );
        state.edit = null;
      })

      .addCase(deleteNote.fulfilled, (state, action) => {
        state.Notes = state.Notes.filter(
          (note) => note._id !== action.payload
        );
      });
  },
});

export const { editNotes, searchNotes } = NotesSlice.actions;
export default NotesSlice.reducer;