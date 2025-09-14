import {Router} from "express";
import { healthcheckController } from "../controllers/healthcheck.controller.js";
const healthcheckRoute = Router();
healthcheckRoute.route("/healthcheck").get(healthcheckController)