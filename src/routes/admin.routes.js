import { Router } from "express";
import { jwt_auth } from "../middlewares/auth.middleware.js";
import { admin_auth } from "../middlewares/admin_auth.middleware.js";
import {
  adminDashboard,
  yearWiseDetails,
  userDetails,
  yearRangeDetails
} from "../controllers/admin.controller.js";

const adminRoute = Router();


adminRoute.use(jwt_auth,admin_auth );

adminRoute.route("/dashboard").get(adminDashboard);

adminRoute.route("/year/:year").get(yearWiseDetails);

adminRoute.route("/yearRange/:from/:to").get(yearRangeDetails);

adminRoute.route("/user/:userId").get(userDetails);

export default adminRoute;
