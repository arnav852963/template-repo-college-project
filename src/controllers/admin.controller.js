import { asynchandler } from "../utilities/asynchandler.js";
import { Paper } from "../models/paper.model.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

const getAllPapers = asynchandler(async (req, res) => {
  const allPapers = await Paper.aggregate([{
    $addFields:{
      year_as_number:{$toInt:"$publishedDate"}
    }
  }
    ,{
    $sort:{
      year_as_number:-1

    }
  },{
    $project:{
      year_as_number:0
    }
    }])
  if(allPapers.length ===0)throw new ApiError(404,"no papers found")
  return res.status(200).json(new ApiResponse(200,allPapers,"all papers fetched successfully"))

})
const getPaperByYear = asynchandler(async (req,res)=>{
  const {year} = req.params;
  if(!year || isNaN(parseInt(year))) throw new ApiError(400,"invalid year")
  const papers = await Paper.find({publishedDate:year.trim()})
  if(papers.length ===0) throw new ApiError(404,"no papers found for this year")
  return res.status(200).json(new ApiResponse(200,papers,`papers for the year ${year} fetched successfully`))
})

const adminDashboard = asynchandler(async (req,res)=>{
  const total=await Paper.find({})
  const conference=await Paper.find({classifiedAs:"conference"})
  const journal=await Paper.find({classifiedAs:"journal"})
  const bookChapter=await Paper.find({classifiedAs:"book chapter"})
  if(total.length===0 || conference.length===0 || journal.length===0 || bookChapter.length===0) throw new ApiError(404,"no papers found")
  return res.status(200).json(new ApiResponse(200,{total:total.length,conference:conference.length,journal:journal.length,bookChapter:bookChapter.length},"admin dashboard data fetched successfully"))

})

const yearWiseDetails = asynchandler(async (req,res)=>{
  const {year} = req.params;
  if(!year || isNaN(parseInt(year))) throw new ApiError(400,"invalid year")
  const total=await Paper.find({publishedDate:year.trim()})
  const conference=await Paper.find({publishedDate:year.trim(),classifiedAs:"conference"})
  const journal=await Paper.find({publishedDate:year.trim(),classifiedAs:"journal"})
  const bookChapter=await Paper.find({publishedDate:year.trim(),classifiedAs:"book chapter"})
  if(total.length===0 || conference.length===0 || journal.length===0 || bookChapter.length===0) throw new ApiError(404,"no papers found for this year")
  return res.status(200).json(new ApiResponse(200,{total:total.length,conference:conference.length,journal:journal.length,bookChapter:bookChapter.length},`year wise details for the year ${year} fetched successfully`))
})



export {getAllPapers,getPaperByYear,adminDashboard,yearWiseDetails}