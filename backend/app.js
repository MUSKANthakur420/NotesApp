import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://notes-app-ufk2.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman/server-to-server requests
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Notely API is running 🚀",
  });
});

import Userrouter from "./routes/user.routes.js";
import noteRouter from "./routes/note.routes.js";
import aiRouter from "./routes/ai.routes.js";

app.use("/api/v1/users", Userrouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/ai", aiRouter);

export { app };