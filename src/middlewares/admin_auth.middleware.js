import cookie from "cookie-parser";
import { ApiError } from "../utilities/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { asynchandler } from "../utilities/asynchandler.js";
const admin_auth = async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) throw new ApiError(401, "didnt got the token during auth")
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if(!decodedToken) throw new ApiError(401, "didnt got the decodedToken during auth")
    if(decodedToken.isAdmin !==true) throw new ApiError(401, "user is not admin")
    next()

  } catch (e) {
    throw new ApiError(401, e.message)

  }

}