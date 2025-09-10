import { Router } from "express";
import { jwt_auth } from "../middlewares/auth.middleware.js";
import { getAllGroups, getGroupById, createGroup, deleteGroup, addPaperToGroup, removePaper, updateGroup } from "../controllers/group.controller.js";

const groupRoutes = Router();
groupRoutes.use(jwt_auth);
//get
groupRoutes.get("/groups", getAllGroups);
groupRoutes.get("/groups/:groupId", getGroupById);
//post
groupRoutes.post("/groups", createGroup);
//update
groupRoutes.patch("/groups/:groupId", updateGroup);
groupRoutes.patch("/groups/:groupId/papers/:paperId", addPaperToGroup);
groupRoutes.patch("/groups/:groupId/papers/:paperId", removePaper);
//del
groupRoutes.delete("/groups/:groupId", deleteGroup);

export default groupRoutes;
