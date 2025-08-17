import {Router} from "express"
import {
  changePassword, deleteUser,
  getUser,
  login_user,
  logout,
  refreshAccessTokens,
  register_user, updateAvatar, updateCoverImage, updateUserProfile,
} from "../controllers/user.controller.js";
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
userRoutes.route("/getUser").get(jwt_auth, getUser)
userRoutes.route("/changePassword").post(jwt_auth ,changePassword)
userRoutes.route("/refreshAccessToken").post(jwt_auth , refreshAccessTokens)
userRoutes.route("/updateDetails").post(jwt_auth , updateUserProfile)
userRoutes.route("/updateAvatar").patch(upload_mul.single("avatar"),jwt_auth,updateAvatar)
userRoutes.route("/updateCoverImage").patch(upload_mul.single("coverImage"),jwt_auth,updateCoverImage)
userRoutes.route("/delete").post(jwt_auth , deleteUser)
export default userRoutes