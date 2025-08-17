import {User} from "../models/user.model.js";
import { asynchandler } from "../utilities/asynchandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import jwt from "jsonwebtoken"
import { upload } from "../utilities/Cloudinary.js";
import { upload_mul } from "../middlewares/multer.middleware.js";
import cookie from "cookie-parser";
import { app } from "../app.js";
import mongoose from "mongoose";
import { verifyGoogleToken } from "../utilities/googleauth.js";
import { on } from "nodemon";
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

  if (!email.includes("@iiitnr.edu.in")) throw new ApiError(400, "enter the administered college email")

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
const googleAuthLogin = asynchandler(async (req,res)=>{
  const {idToken} = req.body
if (!idToken) throw new ApiError(400 , "google never sent token")
  const payload =await  verifyGoogleToken(idToken)
  if (!payload) throw new ApiError(400 , "google didnt verify")
  const {email,name,pic} = payload
  /** @type {import("../models/user.model.js").User} */
  const user = await User.findOne({
    email:email
  }).select("-password -refreshToken")
  if (!user) {
    const created =await  User.create({
      fullName:name,
      email:email,
      avatar:pic,
      username:email.split("@")[0]
    })
    if (!user) throw new ApiError(400 , "user not created")
    const option = {
      http:true,
      secure:true
    }
    const {accessToken, refreshToken} = generateAccessRefershTokens(created._id)
    if (!accessToken || !refreshToken) throw new ApiError(400, "tokens not generated")
    res
      .status(200)
      .cookie("accessToken" , accessToken , option)
      .cookie("refreshToken" , refreshToken,option)
      .json(new ApiResponse(200,created , "logged in "))





  }
  const options = {
    http:true,
    secure:true
  }
  const {accessToken, refreshToken} = generateAccessRefershTokens(user._id)
  if (!accessToken || !refreshToken) throw new ApiError(400, "tokens not generated")
  res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken,options)
    .json(new ApiResponse(200,user , "logged in "))




})
const completeProfile = asynchandler(async (req , res)=>{
  /** @type {import("../models/user.model.js").User} */
  const {department , isAdmin} = req.body
  if (!department || !isAdmin) throw new ApiError(400 , "add details")
  const local_path = req?.file?.path
  if (!local_path)throw new ApiError(400 , "multer ki maaa ka bhosda")
  const onCloud = await upload(local_path)
  if (!onCloud.url) throw new ApiError(400 , "coverImage not uploaded on cloudinary")
  const bool_isAdmin = (typeof isAdmin === "string")
    ? JSON.parse(isAdmin.toLowerCase())
    : Boolean(isAdmin);
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set:{
      department:department,
      isAdmin:bool_isAdmin,
      updateCoverImage:onCloud?.url || ""
    }
  } ,{new:true})
  if (!user) throw new ApiError(400 , "profile not completed")
  res.status(200)
    .json(new ApiResponse(200,user , "profile updated"))


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
const changePassword = asynchandler(async (req , res)=>{
  const {original_password , new_password , confirm_password}  = req.body
  if (!original_password.trim()||!new_password.trim() ||!confirm_password.trim()) throw new ApiError(401 , "np empty strings")
  if (new_password!==confirm_password) throw new ApiError(400 , "doest match with the confirm password")

  /** @type {import("../models/user.model.js").User} */


  const user= await User.findById(req?.user?._id)
  if (!user)  throw new ApiError(400 , "user not fetched ")
  if (!(await user.isPasswordCorrect(original_password)))  throw new ApiError(400 , "password wrong")
  user.password = new_password
  user.save({validateBeforeSave:false})
  res.status(200)
    .json(new ApiResponse(200 ,{} , "password changed"))

})
const refreshAccessTokens = asynchandler(async (req,res)=>{
  /** @type {import("../models/user.model.js").User} */

  const user = await User.findById(req.user._id).select('-password')
  if (!user) throw new ApiError(401, "user no no no")
  const token = req.cookies.refreshToken || req.body.refreshToken
  if (!token) throw new ApiError(401, "noo token")
  if (token !== user.refreshToken) throw new ApiError(500, "maslaa")
  const { accessToken, refreshToken } = await generateAccessRefershTokens(req.user._id)

  const options = {
    http: true,
    secure: true
  }
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {
      user: user,
      new_accessToken: accessToken,
      new_refreshToken: refreshToken
    }, "cookies updated"))





})
const updateUserProfile = asynchandler(async (req,res)=>{
  const {new_email,new_username} = req.body
  if (!new_email.trimEnd() || !new_username.trim()) throw new ApiError(401 , "user please enter something")

  /** @type {import("../models/user.model.js").User} */

  const user = await User.findByIdAndUpdate(req.user._id ,{

    $set:{
      email:new_email,
      username:new_username
    }
  },{new:true})

  res.status(200)
    .json(new ApiResponse(200 , user , "updated details"))





})

const updateAvatar = asynchandler(async (req,res)=>{
  const local_path = req?.file?.path
  if (!local_path) throw new ApiError(401 , "path not found")
  const upload_ = await upload(local_path)
  if (!upload_.url) throw new ApiError(401 , "not uploaded")

  /** @type {import("../models/user.model.js").User} */

  const user = await User.findByIdAndUpdate(req.user._id , {
    $set:{
      avatar:upload_.url
    }
  },{new:true})
  if (!user) throw new ApiError(400,"user not fetched")
  console.log("user new avatar-->",user.avatar)
  res.status(200).json(new ApiResponse(200 , user , "avatar updated"))


})

const updateCoverImage = asynchandler(async (req,res)=>{
  const local_path_ = req?.file?.path
  if (!local_path_) throw new ApiError(401 , "path not found")
  const upload_cover = await upload(local_path_)
  if (!upload_cover.url) throw new ApiError(401 , "not uploaded")

  /** @type {import("../models/user.model.js").User} */

  const user = await User.findByIdAndUpdate(req.user._id , {
    $set:{
      coverImage:upload_cover.url
    }
  },{new:true})
  if (!user) throw new ApiError(400,"user not fetched")
  res.status(200).json(new ApiResponse(200 , user , "avatar updated"))


})
const deleteUser = asynchandler(async (req,res,next)=>{
  const user = await User.findByIdAndDelete(req.user._id)
  if (!user) throw new ApiError(401 , "sorry....user not deleted")

  res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new  ApiResponse(200,{},"logged out and deleted"))

})
const report = asynchandler(async (req,res)=>{
  const paperReport = await User.aggregate([{
    $match:{
      _id: new  mongoose.Types.ObjectId(req.user._id)
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      as:"details",
      pipeline:[{
        $project:{
          title:1,
          author:1,
          publishedDate:1
        }

      }]


    }
  },{
    $addFields:{
      count:{
        $size:"$details"
      },
      all:"$details"


    }
  },{
    $project:{
      all:1,
      count:1
    }
  }])
  if (paperReport.length === 0) throw new ApiError(200 , "report not generated")
  res.status(200)
    .json(new ApiResponse(200 , paperReport, "report generated"))


})



export {register_user , login_user , logout , getUser , changePassword , refreshAccessTokens,updateUserProfile,updateAvatar,updateCoverImage,deleteUser}
