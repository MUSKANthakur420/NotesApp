# 📝 Notely

A notes app I built to learn full stack development — React on the front, Node.js + MongoDB on the back. You can sign up, log in, and manage your own notes. There's also an AI feature that generates structured notes on any topic using Groq's Llama model.

## Why I built this

I wanted to go beyond tutorial projects and actually connect a React frontend to a real backend with auth, a database, and an external API. This project taught me how all those pieces talk to each other.

## What it does

- Register and login with JWT-based authentication
- Add, edit, delete, and search your notes
- Generate AI-powered tutor-style notes on any topic (with formulas, examples, and key points)
- Your notes are private — only you can see them after logging in

## Tech used

**Frontend** — React, Redux Toolkit, React Router, Axios, Vite

**Backend** — Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

**AI** — Groq SDK (Llama 3.3 70b)

## Getting started

Clone the repo

```bash
git clone https://github.com/MUSKANthakur420/NotesApp.git
cd NotesApp
```

Install frontend dependencies
```bash
npm install
```

Install backend dependencies
```bash
cd backend
npm install
```

Set up environment variables — create a `.env` file inside `backend/`:
PORT=8000

MONGODB_URL=your_mongodb_url

ACCESS_TOKEN_SECRET=your_secret

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret

REFRESH_TOKEN_EXPIRY=7d

GROQ_API_KEY=your_groq_api_key

Run the backend
```bash
cd backend
npm run dev
```

Run the frontend (in a new terminal)
```bash
cd NotesApp
npm run dev
```

Open `http://localhost:5173`

## What I learned

- How JWT authentication works end to end
- Why httpOnly cookies are safer than localStorage for tokens
- How Redux async thunks handle API calls and loading/error states
- How Mongoose schemas silently ignore fields not defined in them (learned this the hard way)
- How SSE (Server Sent Events) works for streaming AI responses
- Connecting a React app to an Express backend with CORS and credentials

## Challenges I ran into

- CORS kept blocking requests until I understood that `credentials: true` requires an explicit origin, not a wildcard
- Notes weren't saving with `userId` because the field was missing from the Mongoose schema — Mongoose doesn't throw an error, it just silently drops it
- JWT stores `_id` as a string but MongoDB queries need an ObjectId — had to convert with `new mongoose.Types.ObjectId()`
- bcrypt.compare returns a Promise — missing `await` made every password check fail silently

## Author

Muskan Singh — ECE student at KIET Group of Institutions
[LinkedIn](https://linkedin.com/in/muskan-singh-72b338328) • [GitHub](https://github.com/MUSKANthakur420)
