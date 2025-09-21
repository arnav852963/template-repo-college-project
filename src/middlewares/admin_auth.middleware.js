import cookie from "cookie-parser";
import { ApiError } from "../utilities/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { asynchandler } from "../utilities/asynchandler.js";
const admin_auth = async (req, res, next) => {
  try {
    if(req?.user?.isAdmin !== true) throw new ApiError(401, "You are not an admin")
    next()

  } catch (e) {
    throw new ApiError(401, e.message)

  }

}
export { admin_auth }