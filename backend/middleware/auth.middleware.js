import { asynchandler } from '../utils/asynchandler.js'
import jwt from "jsonwebtoken"

export const verifyJWT = asynchandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).json({ message: "Unauthorized" })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
})