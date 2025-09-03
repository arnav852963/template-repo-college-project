import { Router } from "express";
import { jwt_auth } from "../middlewares/auth.middleware.js";
import { getAllGroups, getGroupById, createGroup, deleteGroup, addPaperToGroup, removePaper, updateGroup } from "../controllers/group.controller.js";

const groupRoutes = Router();
groupRoutes.use(jwt_auth);

groupRoutes.get("/groups", getAllGroups);
groupRoutes.get("/groups/:groupId", getGroupById);
groupRoutes.post("/groups", createGroup);
groupRoutes.patch("/groups/:groupId", updateGroup);
groupRoutes.delete("/groups/:groupId", deleteGroup);
groupRoutes.patch("/groups/:groupId/papers/:paperId", addPaperToGroup);
groupRoutes.patch("/groups/:groupId/papers/:paperId", removePaper);

export default groupRoutes;
