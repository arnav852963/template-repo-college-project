import  {Router} from "express";
const patentRoutes = Router()
import { jwt_auth } from "../middlewares/auth.middleware.js";
import { upload_mul } from "../middlewares/multer.middleware.js";
import {
  uploadPatent,
  updatePatent,
  deletePatent,
  getPatentById,
  getUserPatents
} from "../controllers/patent.controller.js";

const patentRoute = Router();
patentRoute.use(jwt_auth);


patentRoute.route("/uploadPatent").post(upload_mul.single("pdf"), uploadPatent); // upload patent with PDF
patentRoute.route("/updatePatent/:patentId").put(updatePatent);
patentRoute.route("/deletePatent/:patentId").delete(deletePatent);
patentRoute.route("/getPatentById/:patentId").get(getPatentById);
patentRoute.route("/getUserPatents").get(getUserPatents);

export default patentRoutes