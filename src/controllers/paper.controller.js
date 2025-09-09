import {asynchandler} from "../utilities/asynchandler.js";
import {ApiResponse} from "../utilities/ApiResponse.js";
import {ApiError} from "../utilities/ApiError.js";
import {Paper} from "../models/paper.model.js";
import {searchScholarAPI} from "../utilities/scholar.js";
import { upload } from "../utilities/Cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";
import { auth } from "google-auth-library";
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
    citedBy:response.cited_by,



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
    publishedBy:publishedBy,
    isManual:true

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
const getManualUploads = asynchandler(async (req , res)=>{
  const manualPaper = await User.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{
        $match:{
          isManual:true
        }
      },{
        $project:{
          title:1,
          authors:1,
          manualUpload:1,
          tag:1,
          publishedDate:1,
          publishedBy:1,
          citedBy:1,
          pdfUrl:1,

      }
      }],
      as:"manualUploads"
    }
  },{
    $project:{
      manualUploads:1
    }
  }])

})

const getScholarUploads = asynchandler(async (req , res)=>{
  const scholarPaper = await User.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{
        $match:{
          isManual:false
        }
      },{
        $project:{
          title:1,
          authors:1,
          link:1,
          tag:1,
          publishedDate:1,
          publishedBy:1,
          citedBy:1,
          pdfUrl:1,

        }
      }],
      as:"scholarUploads"
    }
  },{
    $project:{
      scholarUploads:1
    }
  }])

})

const filter_search = asynchandler(async (req,res)=>{
  const {title ="", authors="" , tag=""  , isManual} = req.body
  if (title.trim() === ""&& authors.trim() === ""&& tag.trim() === ""&& isManual === undefined) throw new ApiError(400 , "naah")
  const arr = []
  if (!(title.trim()==="")) arr.push({
    title:{
      $regex:title,
      $options:'i'
    }
  })
  if (!(authors.trim()==="")) arr.push({
    authors:{
      $regex:authors,
      $options:'i'
    }
  })
  if (!(tag.trim()==="")) arr.push({
    tag:{
      $regex:tag,
      $options:'i'
    }
  })
  if (!(isManual===undefined)) arr.push({isManual:isManual})

  const search = await User.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{
        $match:{
          $and:arr
        }
      },{$project:{
        link:1,
          manualUpload:1


        }}],
      as:"searchResults"
    }
  },{
    $project:{
      searchResults:1
    }
  }])
  if (search.length === 0 || search[0].searchResults.length === 0) throw new ApiError(400 , "no searches")
  return res.status(200)
    .json(new ApiResponse(200 , search[0] , "here are your search results"))


})

const getPublishedPapers  = asynchandler(async (req , res) =>{
  const published_papers = await User.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req?.user?._id)
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{
        $match:{
          isPublished:true
        }
      },{
        $project:{
          title:1,
          authors:1,
          link:1,
          manualUpload:1
        }
      }],
      as:"publishedPapers"
    }
  },{
    $project:{
      publishedPapers:1
    }
  }])
  if (published_papers.length === 0 || published_papers[0].publishedPapers.length ===0) throw ApiError(400 , "published papers cant be fetched")
  return res.status(200)
    .json(new ApiResponse(200 , published_papers[0] , "here are your published papers"))

})

const getAboutToBePublishedPapers  = asynchandler(async (req , res) =>{
  const about_to_be_published_papers = await User.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req?.user?._id)
    }
  },{
    $lookup:{
      from:"papers",
      localField:"_id",
      foreignField:"owner",
      pipeline:[{
        $match:{
          isPublished:false
        }
      },{
        $project:{
          title:1,
          authors:1,
          link:1,
          manualUpload:1
        }
      }],
      as:"aboutToBePublishedPapers"
    }
  },{
    $project:{
      aboutToBePublishedPapers:1
    }
  }])
  if (about_to_be_published_papers.length === 0 || about_to_be_published_papers[0].aboutToBePublishedPapers.length ===0) throw ApiError(400 , "published papers cant be fetched")
  return res.status(200)
    .json(new ApiResponse(200 , about_to_be_published_papers[0] , "here are your about to be published papers"))

})







export {uploadPaperScholar,uploadPaperManual , getUserPapers , paperById ,deletePaper , searchPaper , filter_search}




// downloadPaper (return Cloudinary link or Scholar link).


// admin flags
// portfolio page
// about to be published
//add a video into the website of how to use it
