import { Router } from "express";
import { jwt_auth } from "../middlewares/auth.middleware.js";
import { uploadPaperScholar, uploadPaperManual, getUserPapers, paperById, deletePaper, searchPaper } from "../controllers/paper.controller.js";
import { upload_mul } from "../middlewares/multer.middleware.js";

const paperRoute = Router();
paperRoute.use(jwt_auth);

paperRoute.route("/addResearchPaper").post(uploadPaperScholar);
paperRoute.route("/addResearchPaperManual").post(upload_mul.single("paper"), uploadPaperManual);
paperRoute.route("/getUserPapers").get(getUserPapers);
paperRoute.route("/paperById/:id").get(paperById);
paperRoute.route("/deletePaper/:id").delete(deletePaper);
paperRoute.route("/searchPaper").get(searchPaper);

export default paperRoute;
