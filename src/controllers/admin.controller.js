import { asynchandler } from "../utilities/asynchandler.js";
import { Paper } from "../models/paper.model.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { User } from "../models/user.model.js";
import { isValidObjectId } from "mongoose";

// const getAllPapers = asynchandler(async (req, res) => {
//   const allPapers = await Paper.aggregate([{
//     $sort:{
//       publishedDate:-1
//     }
//   }])
//   if(allPapers.length ===0)throw new ApiError(404,"no papers found")
//   return res.status(200).json(new ApiResponse(200,allPapers,"all papers fetched successfully"))
//
// })


const adminDashboard = asynchandler(async (req,res)=>{
  const users = await User.aggregate([{
    $match:{
      isAdmin:false
    }
  }])

  const total=await Paper.find({}).sort({publishedDate:-1})
  const conference=await Paper.find({classifiedAs:"conference"})
  const journal=await Paper.find({classifiedAs:"journal"})
  const bookChapter=await Paper.find({classifiedAs:"book chapter"})
  if(total.length===0 || conference.length===0 || journal.length===0 || bookChapter.length===0) throw new ApiError(404,"no papers found")
  return res.status(200).json(new ApiResponse(200,{totalUsers:users.length,range:`from ${total[total.length-1].publishedDate.toLocaleDateString('en-GB')} to ${total[0].publishedDate.toLocaleDateString('en-GB')}`,total:total.length,conference:conference.length,journal:journal.length,bookChapter:bookChapter.length},"admin dashboard data fetched successfully"))

})



const yearRangeDetails = asynchandler(async (req,res)=> {
  const { from, to } = req.params;
  if (!from || isNaN(parseInt(from)) || !to || isNaN(parseInt(to)) || parseInt(from) > parseInt(to)) throw new ApiError(400, "invalid year range")
  const details = await Paper.aggregate([{
    $match: {
      $gte: new Date(`${from.trim()}-01-01`),
      $lte: new Date(`${to.trim()}-12-31`)
    }
  }, {
    $sort: {
      publishedDate: -1
    }
  }])

  if(details.length ===0) throw new ApiError(404,"no papers found for this year range")
  const journals =[]
  const conferences =[]
  const bookChapters =[]
  details.forEach((item) =>{
    if(item.classifiedAs === "journal") journals.push(item)
    else if(item.classifiedAs === "conference") conferences.push(item)
    else bookChapters.push(item)
  })


  return res.status(200).json(new ApiResponse(200,{
    total:details.length,
    journals:journals.length,
    conferences:conferences.length,
    bookChapters:bookChapters.length,
    journalPapers:journals,
    conferencePapers:conferences,
    bookChapterPapers:bookChapters
  },`papers from year range ${from} to ${to} fetched successfully`))

})

const yearWiseDetails = asynchandler(async (req,res)=> {
  const { year } = req.params;
  if (!year || !isNaN(parseInt(year.trim()))) throw new ApiError(400, "invalid year range")
  const years = parseInt(year)
  const alldetails = await Paper.aggregate([{
    $match: {
      $gte: new Date(`${years}-01-01`),
      $lte: new Date(`${years+1}-01-01`)
    }
  }, {
    $sort: {
      publishedDate: -1
    }
  }])

  if(alldetails.length ===0) throw new ApiError(404,"no papers found for this year range")
  const journals =[]
  const conferences =[]
  const bookChapters =[]
  alldetails.forEach((item) =>{
    if(item.classifiedAs === "journal") journals.push(item)
    else if(item.classifiedAs === "conference") conferences.push(item)
    else bookChapters.push(item)
  })


  return res.status(200).json(new ApiResponse(200,{
    total:alldetails.length,
    journals:journals.length,
    conferences:conferences.length,
    bookChapters:bookChapters.length,
    journalPapers:journals,
    conferencePapers:conferences,
    bookChapterPapers:bookChapters
  },`papers from year range ${years} to ${years+1} fetched successfully`))

})



const userDetails = asynchandler(async (req,res)=>{
  const {userId} = req.params
  if(!userId ||!isValidObjectId(userId)) throw new ApiError(400,"invalid user id")
  const user = await User.aggregate([{
    $match: {
      _id: userId,
      isAdmin: false
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{$sort:{publishedDate:-1}}],
      as:"papers"
    }
  },{
    $lookup:{
      from:"projects",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{$sort:{publishedDate:-1}}],
      as:"projects"

    }
  },{
    $lookup:{
      from:"patents",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{$sort:{publishedDate:-1}}],
      as:"patents"
    }
  },{
    $project: {
      papers: 1,
      projects:1,
      patents:1,

    }
  }])
  if(user.length ===0 || user[0].papers.length ===0) throw new ApiError(404,"no user found")

  const journals =[]
  const conferences =[]
  const bookChapters =[]
  user[0].papers.forEach((item) =>{
    if(item.classifiedAs === "journal") journals.push(item)
    else if(item.classifiedAs === "conference") conferences.push(item)
    else bookChapters.push(item)
  })

  return res.status(200).json(new ApiResponse(200,{
    total:user[0].papers.length,
    journals:journals.length,
    conferences:conferences.length,
    bookChapters:bookChapters.length,
    journalPapers:journals,
    conferencePapers:conferences,
    bookChapterPapers:bookChapters,
    projectsCount:user[0].projects.length,
    projects:user[0].projects,
    patentsCount:user[0].patents.length,
    patents:user[0].patents
  },"user details fetched successfully"))

})



export {adminDashboard,yearWiseDetails , userDetails, yearRangeDetails}