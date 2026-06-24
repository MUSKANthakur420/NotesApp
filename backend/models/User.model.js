import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    username:{
        unique:true,
        type:String,
        required:true
    },
    email:{
        unique:true,
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});
userSchema.pre("save",async function () {
    if(!this.isModified("password")) return ;
    this.password=await bcrypt.hash(this.password,10)
});
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
    if(!process.env.ACCESS_TOKEN_SECRET)
         throw new Error("Access token secret is not defined");
    return jwt.sign({
        _id:this._id,
        email:this.email,
        password:this.password
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY }); 
}
userSchema.methods.generateRefreshToken=function(){
    if(!process.env.REFRESH_TOKEN_SECRET)
         throw new Error("Refresh token secret is not defined");
    return jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY });
}
export default mongoose.model("Users", userSchema)