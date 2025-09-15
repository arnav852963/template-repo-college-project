import { Router } from "express";
import { jwt_auth } from "../middlewares/auth.middleware.js";
import {
  getAllGroups, getGroupById, createGroup, deleteGroup, addPaperToGroup, removePaper, updateGroup,
  getAllGroupPapers,
} from "../controllers/group.controller.js";

const groupRoutes = Router();
groupRoutes.use(jwt_auth);
//get
groupRoutes.get("/groups", getAllGroups);
groupRoutes.get("/groups/:groupId", getGroupById);
groupRoutes.route("/getGroupPapers/:groupId").get(getAllGroupPapers)
//post
groupRoutes.post("/groups", createGroup);
//update
groupRoutes.patch("/groups/:groupId", updateGroup);
groupRoutes.patch("/groups/:groupId/papers/:paperId", addPaperToGroup);
groupRoutes.patch("/groups/:groupId/papers/:paperId", removePaper);
//del
groupRoutes.delete("/groups/:groupId", deleteGroup);

// add a controller which will create group of all the resrachPaper using a tag say AI ML etc
//add a controller that can get u all papers of a group

export default groupRoutes;
