import {User} from "../models/user.model.js";
import { asynchandler } from "../utilities/asynchandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import jwt from "jsonwebtoken"
import { upload } from "../utilities/Cloudinary.js";
import { upload_mul } from "../middlewares/multer.middleware.js";
import cookie from "cookie-parser";
const generateAccessRefershTokens = async function(_id){
  try{
    /** @type {import("../models/user.model.js").User} */
    const user = await User.findById(_id)
    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()
    user.refreshToken = refreshToken
    user.save({validateBeforeSave:false})
    return {
      accessToken:accessToken,
      refreshToken:refreshToken
    }




  }catch (e) {
    throw new ApiError(400 , "tokens not generated in the function")
  }
}

const register_user = asynchandler(async (req , res , _)=>{
  const {fullName , username, password , email, department,isAdmin}=req.body
  if ([fullName , username, password , email, department,isAdmin].some((item)=>{
    if (item) {
      if (!item.trim()) return true
    }
    return !item
  })) throw new ApiError(400 , "all fields are required")
  const bool_isAdmin = (typeof isAdmin === "string")
    ? JSON.parse(isAdmin.toLowerCase())
    : Boolean(isAdmin);

  if (!email.includes("iiitnr.edu.in")) throw new ApiError(400, "enter the administered college email")

  const exists = await User.findOne({
    $or:[{username} , {email}]
  })
  if(exists) throw new ApiError(400, "user already exists")
 const local_path_avatar = req?.files?.avatar[0]?.path
  if (!local_path_avatar) throw new ApiError(401, "multer didnt upload avatar")
  const local_path_coverImage = req?.files?.coverImage[0].path
  if (!local_path_coverImage) throw new ApiError(401, "multer didnt upload coverImage")

  const upload_avatar =await  upload(local_path_avatar)
  if ( !upload_avatar.url) throw new ApiError(401 , "avatar cloudinary error")
  const upload_coverImage =await  upload(local_path_coverImage)
  if ( !upload_coverImage.url) throw new ApiError(401 , "coverImage cloudinary error")
  const user =await User.create({
    username:username,
    fullName:fullName,
    avatar:upload_avatar.url || "lund na kuch",
    coverImage:upload_coverImage.url||"lund na kuch",
    email:email,
    department:department,
    isAdmin:bool_isAdmin,
    password:password
  })
  const response = await User.findById(user._id).select("-password -refreshToken")
if (bool_isAdmin) {
  return res
    .status(200)
    .json(new ApiResponse(200, response, "user created as admin"))
}
  return res
    .status(200)
    .json(new ApiResponse(200, response, "user created"))













})
const login_user = asynchandler(async (req , res ,_)=>{
  const {email , password} = req.body
  if (!email.trim() || !password) throw new ApiError(401 , "enter full details")
  /** @type {import("../models/user.model.js").User} */
  const user = await User.findOne({
    email
  });
  if (!user) throw new ApiError(401 , "please register")

  /** @type {import("../models/user.model.js").User} */
  const isCorrect = await user.isPasswordCorrect(password)
  if (!isCorrect) throw new ApiError(401 , "password is wrong")
  const {accessToken , refreshToken} = await generateAccessRefershTokens(user._id)
  const options = {
    http:true,
    secure:true
  }
  user.refreshToken = ""
  user.password = ""

  if (user.isAdmin) {
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken
      }, "logged in as admin"))
  }
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken
    }, "logged in as admin"))





})
const logout= asynchandler(async (req,res,_)=>{
const user =await User.findByIdAndUpdate(req?.user?._id , {
  // $set:{
  //   refreshToken:undefined
  // }
  $unset: { refreshToken: 1 }
} , {new:true}).select("-password")
  const options = {
  http: true,
    secure: true
  }
  res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200 , user , "logged out successfully"))



})
const getUser =asynchandler(async (req , res )=>{
  const user = await User.findById(req?.user?._id).select("-password -refreshToken")
  res.status(200).json(new ApiResponse(200 , user , "here are your details"))
})
const changePassword = asynchandler(async (res , req)=>{

})



export {register_user , login_user , logout , getUser}
