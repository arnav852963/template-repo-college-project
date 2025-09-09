import cookie from "cookie-parser";
import { ApiError } from "../utilities/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { asynchandler } from "../utilities/asynchandler.js";
const jwt_auth =asynchandler( async (req , res,next )=>{
  try {
    const token = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) throw new ApiError(401, "didnt got the token during auth")
    console.log("access token ---->", token)
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!decodedToken) throw new ApiError(401, "didnt got the decodedToken during auth")
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if (!user) throw new ApiError(401, "user didnt fetched during auth")
    req.user = user
    next()
  } catch (e){
    throw new ApiError(401 , "Please Login")
  }

})
export {jwt_auth}