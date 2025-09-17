import { asynchandler } from "../utilities/asynchandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { Project } from "../models/project.model.js";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import { upload } from "../utilities/Cloudinary.js";

const uploadProject = asynchandler(async (req, res) => {
  const { name, description, startDate, endDate, status, teamMembers } = req.body;

  if (!name || !startDate) throw new ApiError(400, "enter details properly");

  const membersArray = [];
  if (teamMembers) {
    teamMembers.split(",").forEach(m => {
      if (m.trim() !== "") membersArray.push(m.trim());
    });
  }

  const project = await Project.create({
    name: name,
    description: description || "",
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    status: status || "Not Started",
    teamMembers: membersArray,
    owner: req.user._id
  });

  if (!project) throw new ApiError(400, "can't create project");

  return res.status(200)
    .json(new ApiResponse(200, project, "project created successfully"));
});

const updateProject = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, startDate, endDate, status, teamMembers } = req.body;

  if (!projectId || !isValidObjectId(projectId)) throw new ApiError(400, "invalid project id");

  const project = await Project.findOne({ _id: projectId, owner: req.user._id });
  if (!project) throw new ApiError(404, "project not found");

  if (name) project.name = name;
  if (description) project.description = description;
  if (startDate) project.startDate = new Date(startDate);
  if (endDate) project.endDate = new Date(endDate);
  if (status) project.status = status;
  if (teamMembers) {
    const membersArray = [];
    teamMembers.split(",").forEach(m => {
      if (m.trim() !== "") membersArray.push(m.trim());
    });
    project.teamMembers = membersArray;
  }

  await project.save();

  return res.status(200)
    .json(new ApiResponse(200, project, "project updated successfully"));
});

const getProjectById = asynchandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId || !isValidObjectId(projectId)) throw new ApiError(400, "invalid project id");

  const project = await Project.findOne({ _id: projectId, owner: req.user._id });
  if (!project) throw new ApiError(404, "project not found");

  return res.status(200)
    .json(new ApiResponse(200, project, "here is your project"));
});

const deleteProject = asynchandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId || !isValidObjectId(projectId)) throw new ApiError(400, "invalid project id");

  const deleted = await Project.findOneAndDelete({ _id: projectId, owner: req.user._id });
  if (!deleted) throw new ApiError(400, "can't delete project");

  return res.status(200)
    .json(new ApiResponse(200, deleted, "project deleted successfully"));
});

const getUserProjects = asynchandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id });
  if (!projects || projects.length === 0) throw new ApiError(400, "can't get projects");

  return res.status(200)
    .json(new ApiResponse(200, projects, "here are your projects"));
});

export { uploadProject, updateProject, getProjectById, deleteProject, getUserProjects };