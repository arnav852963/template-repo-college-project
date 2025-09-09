import {User} from "../models/user.model.js";
import mongoose from "mongoose";
import { asynchandler } from "../utilities/asynchandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { Paper } from "../models/paper.model.js";
import { Star } from "../models/star.model.js";

const portfolio = asynchandler(async (req,res)=> {
  const user = await User.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)
    }
  }, {

  }, {}])
})