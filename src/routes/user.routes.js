import {Router} from "express"
import {
  changePassword, completeProfile, deleteUser,
  getUser, googleAuthLogin,
  login_user,
  logout,
  refreshAccessTokens,
  register_user, report, setPassword, updateAvatar, updateCoverImage, updateUserProfile,
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

//post
userRoutes.route("/login").post(login_user)
userRoutes.route("/logout").post(jwt_auth , logout)

userRoutes.route("/googleLogin").post(googleAuthLogin)
userRoutes.route("/completeProfile").post(jwt_auth,upload_mul.single("coverImage"),completeProfile)
userRoutes.route("/setPassword").post(jwt_auth , setPassword)
//get
userRoutes.route("/getUser").get(jwt_auth, getUser)
userRoutes.route("/report").get(jwt_auth,report)
//patch
userRoutes.route("/changePassword").patch(jwt_auth ,changePassword)
userRoutes.route("/refreshAccessToken").patch(jwt_auth , refreshAccessTokens)
userRoutes.route("/updateDetails").patch(jwt_auth , updateUserProfile)
userRoutes.route("/updateAvatar").patch(upload_mul.single("avatar"),jwt_auth,updateAvatar)
userRoutes.route("/updateCoverImage").patch(upload_mul.single("coverImage"),jwt_auth,updateCoverImage)
//del
userRoutes.route("/delete").delete(jwt_auth , deleteUser)

//every controller tested except report....
export default userRoutes
// add forgot password and user mail verification