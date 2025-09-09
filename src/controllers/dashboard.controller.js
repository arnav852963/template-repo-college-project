import { asynchandler } from "../utilities/asynchandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utilities/ApiError.js";
import { Paper } from "../models/paper.model.js";
import { Star } from "../models/star.model.js";
import { ApiResponse } from "../utilities/ApiResponse.js";



const userStats = asynchandler(async (req,res)=>{
  const details = await User.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      as:"papers"
    }
  },{
    $lookup:{
      from:"stars",
      localField: "_id",
      foreignField: "staredBy",
      as :"stars"


    }
  },{
    $lookup:{
      from: "papers",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{
        $match:{
          isPublished:true
        }
    }
  ] ,
    as:"published"}
  },{
    $addFields:{
      papersCount:{$size:"$papers"},
      starsCount:{$size:"$stars"},
      publishedCount:{$size:"$published"},
      notPublishedCount:{$subtract:[{$size:"$papers"},{$size:"$published"}]}


  }
  },
    {
    $project:{
      papersCount:1,
      starsCount:1,
      publishedCount:1,
      notPublishedCount:1
    }
  }])
  if (details.length<=0) throw new ApiError(400 , "no details found")
  return res.status(200)
      .json(new ApiResponse(200 , details[0] , "here are your stats"))

})

export {userStats}

