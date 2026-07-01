
import { asynchandler } from "../utils/asynchandler.js";
import { apires } from "../utils/apires.js";
import { apierror } from "../utils/apierror.js";
import User from '../models/User.model.js'
const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        return { accessToken, refreshToken }
    }
    catch (error) {
        console.error("Error generating tokens:", error);
        throw error;
    }
};
const registerUser = asynchandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" })
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    const { accessToken, refreshToken } =await generateAccessTokenAndRefreshToken(newUser._id);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        accessToken
    })
});
const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        throw new apierror(404, "User not found");
    const passwordCorrect = await user.isPasswordCorrect(password);
    if (!passwordCorrect)
        throw new apierror(401, "Invalid password");
    const { accessToken, refreshToken } =await generateAccessTokenAndRefreshToken(user._id);
    const loggedIn = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true, //browser cannot access the cookie via JavaScript
        secure: process.env.NODE_ENV === "production", //only send cookie over HTTPS for secure connections
    };
    return res.status(200)
        .cookie("accessToken", accessToken, options) //helps prevent XSS attacks by restricting access to the cookie from client-side scripts
        .cookie("refreshToken", refreshToken, options) 
        .json(new apires(200, { user: loggedIn }, "Login success"));
})
const logoutUser = asynchandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        throw new apierror(404, "User not found");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apires(200, {}, "Logout success"));
});
export {
    registerUser,
    loginUser,
    logoutUser
}