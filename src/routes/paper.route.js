import { Router } from "express";
import { jwt_auth } from "../middlewares/auth.middleware.js";
import { upload_mul } from "../middlewares/multer.middleware.js";
import {
  uploadPaperScholar,
  uploadPaperManual,
  getUserPapers,
  paperById,
  deletePaper,
  searchPaper,
  filter_search,
  getManualUploads,
  getScholarUploads,
  getPublishedPapers,
  getAboutToBePublishedPapers,
  addTag
} from "../controllers/paper.controller.js";

const paperRoute = Router();
paperRoute.use(jwt_auth);

// Research paper routes
paperRoute.route("/addResearchPaper").post(uploadPaperScholar);
paperRoute.route("/addResearchPaperManual").post(upload_mul.single("paper"), uploadPaperManual);

// Fetching routes
paperRoute.route("/getUserPapers").get(getUserPapers);
paperRoute.route("/paperById/:paperId").get(paperById);
paperRoute.route("/deletePaper/:paperId").delete(deletePaper);
paperRoute.route("/searchPaper").get(searchPaper);

// functionality routes
paperRoute.route("/filterSearch").post(filter_search);
paperRoute.route("/manualUploads").get(getManualUploads);
paperRoute.route("/scholarUploads").get(getScholarUploads);
paperRoute.route("/publishedPapers").get(getPublishedPapers);
paperRoute.route("/aboutToBePublishedPapers").get(getAboutToBePublishedPapers);
paperRoute.route("/addTag/:paperId").post(addTag);

export default paperRoute;
