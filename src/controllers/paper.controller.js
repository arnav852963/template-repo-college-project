import {asynchandler} from "../utilities/asynchandler.js";
import {ApiResponse} from "../utilities/ApiResponse.js";
import {ApiError} from "../utilities/ApiError.js";
import {Paper} from "../models/paper.model.js";
import {searchScholarAPI} from "../utilities/scholar.js";
const uploadPaperScholar = asynchandler(async (req,res)=>{
  const {query} = req.body
  if (!query.trim()) throw ApiError(400 , "enter some query")
  const response = await searchScholarAPI(query)
  if (!response || response.length ===0) throw new ApiError(400 , "scholar search not working")
  res.status(200)
    .json(new ApiResponse(200,response,"here is your search"))


})
const uploadPaperManual = asynchandler(async ()=>{

})

