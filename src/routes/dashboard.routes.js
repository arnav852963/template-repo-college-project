import {Router} from "express";
import {jwt_auth} from "../middlewares/auth.middleware.js";
import {userStats} from "../controllers/dashboard.controller.js";
const dashboardRoutes = Router()
dashboardRoutes.use(jwt_auth)
dashboardRoutes.route("/userStats").get(userStats)

export default dashboardRoutes