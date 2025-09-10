import {User} from "../models/user.model.js";
import mongoose from "mongoose";
import { asynchandler } from "../utilities/asynchandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { Paper } from "../models/paper.model.js";
import { Star } from "../models/star.model.js";
import { Portfolio } from "../models/portfolio.model.js";

const portfolio = asynchandler(async (req,res)=> {
  const {description , profileLink  , phoneNo , socialLinks} = req.body;
  if(!description || !profileLink || !phoneNo || !socialLinks){
    throw new ApiError(400 , "All fields are required")
  }
  if(phoneNo.trim().length !==10){
    throw new ApiError(400, "Phone number must be 10 digits")
  }

  const existingPortfolio = await Portfolio.findOne({owner:req.user._id});
  if(existingPortfolio){
    throw new ApiError(400 , "Portfolio already exists")
  }
  const user = await User.findById(req.user._id);
  if(!user){
    throw new ApiError(404 , "User not found")
  }
  const links =[]
  socialLinks.split(",").forEach(link => {
    links.push(link.trim())
  })
const newPortfolio = await Portfolio.create({
  owner:req.user._id,
  description:description,
  profileLink:profileLink.trim(),
  phoneNo:phoneNo.trim(),
  socialLinks:links,
  name:user.fullName,
  avatar:user.avatar,
  department:user.department,
  designation:user.designation
})
  if (!newPortfolio) {
    throw new ApiError(500, "Failed to create portfolio");
  }
  const gatherPapers = await User.aggregate([{
    $match:{_id: new mongoose.Types.ObjectId(req.user._id)}
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      as:"papers"
    }
  },{
    $project:{papers:1}
  }])
  newPortfolio.papers = gatherPapers[0].papers;
  const completedPortfolio  = await newPortfolio.save();
  if(!completedPortfolio){
    throw new ApiError(500 , "Failed to create portfolio")
  }
return res.status(201).json(new ApiResponse(201 , "Portfolio created successfully" , completedPortfolio))
})