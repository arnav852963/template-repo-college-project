import {Router} from "express"
import { getUser, login_user, logout, register_user } from "../controllers/user.controller.js";
import { upload_mul } from "../middlewares/multer.middleware.js";
import { jwt_auth } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";
const userRoutes = Router()
userRoutes.route("/register").post(upload_mul.fields([{
  name:"avatar",
  maxCount:1

},{
  name:"coverImage",
  maxCount: 1

}]) , register_user)
userRoutes.route("/login").post(login_user)
userRoutes.route("/logout").post(jwt_auth , logout)
userRoutes.route("/getUser").post(jwt_auth, getUser)
export default userRoutes