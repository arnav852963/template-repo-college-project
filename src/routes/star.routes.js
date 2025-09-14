import { Router } from "express";
import { jwt_auth } from "../middlewares/auth.middleware.js";
import { getStaredPapers, starPaper } from "../controllers/star.controller.js";
const starRoutes = Router()
starRoutes.use(jwt_auth)

starRoutes.route("/toggleStar/:paperId").post(starPaper)
starRoutes.route("/getAllStarPapers").get(getStaredPapers)
//star routes saare checked

export default starRoutes