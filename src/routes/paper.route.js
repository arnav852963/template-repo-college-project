import {Router} from "express";
import { upload_mul } from "../middlewares/multer.middleware.js";
import {jwt_auth} from "../middlewares/auth.middleware.js";
import { uploadPaperManual, uploadPaperScholar } from "../controllers/paper.controller.js";

const paperRoute=Router()
paperRoute.use(jwt_auth)

paperRoute.route("/addResearchPaper").post(uploadPaperScholar)
paperRoute.route("/addResearchPaperManual").post(upload_mul.single("paper") , uploadPaperManual)

export default paperRoute