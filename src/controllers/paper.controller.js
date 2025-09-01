import {asynchandler} from "../utilities/asynchandler.js";
import {ApiResponse} from "../utilities/ApiResponse.js";
import {ApiError} from "../utilities/ApiError.js";
import {Paper} from "../models/paper.model.js";
import {searchScholarAPI} from "../utilities/scholar.js";
import { upload } from "../utilities/Cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";
const uploadPaperScholar = asynchandler(async (req,res)=>{
  const {query} = req.body
  if (!query.trim()) throw ApiError(400 , "enter some query")
  const response = await searchScholarAPI(query)
  if (!response || response.length ===0) throw new ApiError(400 , "scholar search not working")
  const addPaper = await Paper.create({
    title:response.title,
    authors:response.authors.split(",").map(a => a.trim()),
    publishedBy:response.publishedBy,
    link:response.link,
    publishedDate:response.year,
    owner:req?.user?._id,
    pdfUrl:response.pdf_url,
    citedBy:response.cited_by


  })
  if (!addPaper) throw new ApiError(400 , "paper not added to the  database")
  res.status(200)
    .json(new ApiResponse(200,addPaper,"here is your search"))


})
const uploadPaperManual = asynchandler(async (req , res)=>{
  const {title , author , publishedDate , publishedBy} = req.body;
  if (!title.trim() || !author.trim() || publishedDate.trim() ||  !publishedBy.trim()) throw new ApiError(400 , "enter details properly")

  const local_pdf = req.file.path;
  if (!local_pdf) throw new ApiError(400 , "multer ne gendd leli")
  const upload_pdf = await upload(local_pdf);
  if (!upload_pdf.url) throw new ApiError(400 , "cloudinary choduu")

  const paper = await Paper.create({
    title:title,
    author:author,
    manualUpload:upload_pdf.url || "",
    publishedDate:publishedDate,
    owner:req?.user?._id,
    publishedBy:publishedBy
  })
if (!paper) throw new ApiError(400 , "cant create paper")
  return res.status(200)
    .json(new ApiResponse(200,paper,"paper uploaded manually"))
})

const getUserPapers = asynchandler(async (req,res)=>{
  const papers = await  User.aggregate([{
    $match: new mongoose.Types.ObjectId(req?.user?._id)
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      as:"collection"
    }
  },{
    $project:{
      collection:1
    }
  }])
  if (papers.length === 0 || papers.collection.byteLength ===0)  throw new ApiError(400 , "cant get papers")

  return res.status(200)
    .json(new ApiResponse(200,papers[0],"here is your collection"))

})

const paperById = asynchandler(async (req,res)=>{
  const {paperId} = req.params
  if (!paperId.trim() || !isValidObjectId(paperId)) throw new ApiError(400 , "naah")

  const paper = await Paper.findById(paperId)
  if (!paper) throw new ApiError(400 , "paper not found")
  return res.status(200)
    .json(new ApiResponse(200,paper,"your paper"))




})
const deletePaper = asynchandler(async (req,res)=>{
  const {paperId} = req.params

  if (!paperId.trim() || !isValidObjectId(paperId)) throw new ApiError(400 , "naah")

  const deleted = await Paper.findByIdAndDelete(paperId)
  if (!deleted) throw new ApiError(400 , " paper not deleted")

  return res.status(200)
    .json(new ApiResponse(200,deleted,"your paper deleted"))
})
const searchPaper = asynchandler(async (req,res)=>{
  const { page, query, sortBy, sortType, userId } = req.query
  if(!query ||!sortBy||!sortType||!userId||!isValidObjectId(userId)) throw new ApiError(400 , "nah")

  const limit = 10
  const skip = (page-1)*limit
  const searchResult = await User.aggregate([{
    $match:{
      _id: new mongoose.Types.ObjectId(userId)
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{
        $match:{
          title:{
            $regex:query,
            $options:"i"
          }
        }


      },{
        $sort:{
          [sortBy]:sortType === "asc"  ? 1:-1
        }

      },{
        $skip:skip,
        $limit:limit

      },{
        $project:{
          title:1,
          link:1,
          manualUpload:1,


        }
      }],
      as:"search"
    }
  },{
    $project:{
      search:1
    }

  }])

  if (searchResult.length===0 || searchResult[0].search.length===0)  throw new ApiError(400 , "cant search")
  return res.status(200)
    .json(new ApiResponse(200,searchResult[0],"your search"))


})



export {uploadPaperScholar,uploadPaperManual , getUserPapers , paperById ,deletePaper , searchPaper}




// downloadPaper (return Cloudinary link or Scholar link).