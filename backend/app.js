import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notes-4bi4eq87p-420royalrajput50806-5145s-projects.vercel.app"
    ],
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookies
app.use(cookieParser());

// Static files
app.use(express.static("public"));

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Notely API is running 🚀"
  });
});

// Routes
import Userrouter from "./routes/user.routes.js";
import noteRouter from "./routes/note.routes.js";   // ← add this
import aiRouter from './routes/ai.routes.js'// ← add this
app.use("/api/v1/users", Userrouter);
app.use("/api/v1/notes", noteRouter);   
app.use('/api/ai', aiRouter)            // ← add this

export { app };