import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const Userrouter=Router();
Userrouter.route("/register").post(registerUser);
Userrouter.route("/login").post(loginUser);
Userrouter.route("/logout").post(verifyJWT,logoutUser)
export default Userrouter