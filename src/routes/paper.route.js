import {Router} from "express";
import { upload_mul } from "../middlewares/multer.middleware.js";
import {jwt_auth} from "../middlewares/auth.middleware.js";

const paperRoute=Router()

paperRoute.route("/addResearchPaper").post()

export default paperRoute