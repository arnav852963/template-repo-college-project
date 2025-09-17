import {Router} from "express";
import {jwt_auth} from "../middlewares/auth.middleware.js";
import {
  uploadProject,
  updateProject,
  deleteProject,
  getProjectById,
  getUserProjects
} from "../controllers/project.controller.js";

const projectRoute = Router();
projectRoute.use(jwt_auth);


projectRoute.route("/uploadProject").post(uploadProject);
projectRoute.route("/updateProject/:projectId").put(updateProject);
projectRoute.route("/deleteProject/:projectId").delete(deleteProject);
projectRoute.route("/getProjectById/:projectId").get(getProjectById)





export default projectRoute