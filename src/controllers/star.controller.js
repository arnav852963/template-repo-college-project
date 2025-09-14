import mongoose,{isValidObjectId} from "mongoose";
import { Star } from "../models/star.model.js";
import { asynchandler } from "../utilities/asynchandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { User } from "../models/user.model.js";

const starPaper = asynchandler(async (req,res)=>{
  const {paperId} = req.params

  if (!paperId || !isValidObjectId(paperId)) throw new ApiError(400 , "naah")
  const exists = await Star.findOne({
    paper:paperId,
    staredBy:req.user._id
  })
  if (exists){
    const deleteIt = await Star.deleteOne({
      paper:paperId,
      staredBy:req.user._id
    })
    if (deleteIt.deletedCount ===0) throw new ApiError(400 , "still star")
    return  res.status(200)
      .json(new ApiResponse(200 , {} , "star removed"))
  }
  const newStar = await Star.create({
    paper:paperId,
    staredBy:req.user._id
  })
  if (!newStar) throw new ApiError(400 , "not stared")
  return res.status(200)
    .json(new ApiResponse(200 , newStar,"paper stared"))


})

const getStaredPapers = asynchandler(async (req,res)=>{
  const getPapers = await User.aggregate([{
    $match:{
      _id: new mongoose.Types.ObjectId(req.user._id)

    }
  },{
    $lookup:{
      from:"stars",
      localField:"_id",
      foreignField:"staredBy",
      pipeline:[{
        $lookup:{
          from:"paper",
          localField:"paper",
          foreignField:"_id",
          as:"starPapers",
          pipeline:[{
            $project:{
              title:1,
              authors:1,
              link:1,
              manualUpload:1,
              tag:1,
              publishedDate:1,
              publishedBy:1,
            }
          }]
        }

    } ,{
        $unwind: "$starPapers"
      }, {
        $replaceRoot:{newRoot:"$starPapers"}

      } ],
      as:"allStarPapers"
    }
  },{
    $project:{
      allStarPapers:1
    }
  }])
  if (getPapers.length ===0 || getPapers[0].allStarPapers.length === 0) throw new ApiError(400 , "cant get stared papers")
  return res.status(200)
    .json(new ApiResponse(200 , getPapers , "here are your stared papers"))


})
export {starPaper,getStaredPapers}