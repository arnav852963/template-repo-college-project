import mongoose,{isValidObjectId} from "mongoose";
import { Star } from "../models/star.model.js";
import { asynchandler } from "../utilities/asynchandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { User } from "../models/user.model.js";
import { Group } from "../models/group.model.js";
import { Paper } from "../models/paper.model.js";
import { exists } from "node:fs";
import { paperById } from "./paper.controller.js";

const createGroup = asynchandler(async (req,res)=>{
  const {name , description} = req.body

  if (!name.trim() || !description.trim() ) throw new ApiError(400 , "naaaah")
  const group = await Group.create({
    name:name,
    description:description,
    owner:req.user._id
  })

  if (!group) throw new ApiError(400 , "group not created")
  return res.status(200)
    .json(new ApiResponse(200 , group , "group created"))

})
const addPaperToGroup = asynchandler(async (req ,res)=>{
  const {paperId , groupId} = req.params
  if (!paperId || !isValidObjectId(paperId) || !groupId || !isValidObjectId(groupId)) throw new ApiError(400 , "naah")

  const addPaper = await Group.findByIdAndUpdate(groupId,
    {
      $addToSet:{
        papers:paperId
      }

    } , {new:true})

  if (!addPaper) throw new ApiError(400 , "paper not added")
  return res.status(200)
    .json(new ApiResponse(200 , addPaper , "paper added"))









})
const updateGroup = asynchandler(async (req,res) =>{
  const {groupId} = req.params
  const {name , description} = req.body
  if (!groupId || !name ||!description || !isValidObjectId(groupId)) throw new ApiError(400 , "naah")
  const updated = await Group.findByIdAndUpdate(groupId,{
    $set:{
      name:name,
      description:description
    }
  },{new:true}).select("-owner")
  if (!updated) throw new ApiError(400 ,"group not updated")

  res.status(200)
    .json(new ApiResponse(200 ,updated , "group updated" ))


})
const getGroupById = asynchandler(async (req,res)=>{
  const {groupId} = req.params
  if (!groupId || !isValidObjectId(groupId)) throw new ApiError(400 , "naah")
  const get = await Group.findById(groupId)
  if (!get) throw new ApiError(400 , "cant fetch group")
  return res.status(200)
    .json(new ApiResponse(200 , get , "heres your group"))


})

const removePaper = asynchandler(async (req , res) =>{
  const {paperId , groupId} = req.params
  if (!paperId||!groupId||isValidObjectId(paperId) ||!isValidObjectId(groupId)) throw new ApiError(400 , "naah")

  const remove = await Group.findByIdAndUpdate(groupId,{
    $pull:{
      papers: paperId
    }
  },{new:true})
  if (!remove) throw new ApiError(400 , "paper not removed")
  return res.status(200)
    .json(new ApiResponse(200 , remove , "paper removed"))



})
const  deleteGroup = asynchandler(async (req,res)=>{

  const {groupId} = req.params
  if (!groupId||!isValidObjectId(groupId))throw new ApiError(400 , "naah")
  const del = await Group.findByIdAndDelete(groupId)
  if (!del) throw new ApiError(400 , "froup not deleted")
    return res.status(200)
      .json(new ApiResponse(200 , del , "deleted group"))

})
const getAllGroups = asynchandler(async (req,res)=>{
  const all = await Group.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)
    }
  },{
    $lookup:{
      from:"groups",
      localField:"_id",
      foreignField:"owner",
      as:"groups"
    }
  },{
    $project:{
      groups:1
    }
  }])
  if (all.length===0 || all.groups.length === 0) throw new ApiError(400 , "cant fetch groups")
  return res.status(200)
    .json(new ApiResponse(200 , all[0] , "here is your group collection"))
})
export {createGroup , getAllGroups , getGroupById , deleteGroup , addPaperToGroup , removePaper , updateGroup}