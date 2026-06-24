import { Router } from "express";
import { generateNote } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const aiRouter = Router();

aiRouter.use(verifyJWT);

aiRouter.route("/generate").post(generateNote);

export default aiRouter;