import { Patent } from "../models/patent.model.js";
import { asynchandler } from "../utilities/asynchandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { upload } from "../utilities/Cloudinary.js";
import mongoose,{isValidObjectId} from "mongoose";
const uploadPatent = asynchandler(async (req, res) => {
  const { title, abstract, applicationNumber, filedDate, status, tags } = req.body;

  if (!title || !abstract || !applicationNumber || !filedDate) {
    throw new ApiError(400, "enter details properly");
  }

  const existing = await Patent.findOne({ applicationNumber });
  if (existing) throw new ApiError(400, "patent with this application number already exists");

  const local_pdf = req.file?.path;
  if (!local_pdf) throw new ApiError(400, "multer messed");

  const upload_pdf = await upload(local_pdf);
  if (!upload_pdf.url) throw new ApiError(400, "cloudinary messed");

  const tagArray = [];
  if (tags) {
    tags.split(",").forEach(t => {
      if (t.trim() !== "") tagArray.push(t.trim());
    });
  }

  const patent = await Patent.create({
    title: title,
    abstract: abstract,
    applicationNumber: applicationNumber,
    filedDate: new Date(filedDate),
    status: status || "Filed",
    pdfUrl: upload_pdf.url,
    owner: req.user._id,
    tags: tagArray
  });

  if (!patent) throw new ApiError(400, "can't create patent");

  return res.status(200)
    .json(new ApiResponse(200, patent, "patent uploaded successfully"));
});


const updatePatent = asynchandler(async (req, res) => {
  const { patentId } = req.params;
  const { title, abstract, filedDate, status, tags } = req.body;

  if (!patentId || !isValidObjectId(patentId)) throw new ApiError(400, "invalid patent id");

  const patent = await Patent.findOne({ _id: patentId, owner: req.user._id });
  if (!patent) throw new ApiError(404, "patent not found");

  if (title) patent.title = title;
  if (abstract) patent.abstract = abstract;
  if (filedDate) patent.filedDate = new Date(filedDate);
  if (status) patent.status = status;
  if (tags) {
    const tagArray = [];
    tags.split(",").forEach(t => {
      if (t.trim() !== "") tagArray.push(t.trim());
    });
    patent.tags = tagArray;
  }

  await patent.save();

  return res.status(200)
    .json(new ApiResponse(200, patent, "patent updated successfully"));
});

const getPatentById = asynchandler(async (req, res) => {
  const { patentId } = req.params;

  if (!patentId || !isValidObjectId(patentId)) throw new ApiError(400, "invalid patent id");

  const patent = await Patent.findOne({ _id: patentId, owner: req.user._id });
  if (!patent) throw new ApiError(404, "patent not found");

  return res.status(200)
    .json(new ApiResponse(200, patent, "here is your patent"));
});

const deletePatent = asynchandler(async (req, res) => {
  const { patentId } = req.params;

  if (!patentId || !isValidObjectId(patentId)) throw new ApiError(400, "invalid patent id");

  const deleted = await Patent.findOneAndDelete({ _id: patentId, owner: req.user._id });
  if (!deleted) throw new ApiError(400, "can't delete patent");

  return res.status(200)
    .json(new ApiResponse(200, deleted, "patent deleted successfully"));
});

const getUserPatents = asynchandler(async (req, res) => {
  const patents = await Patent.find({ owner: req.user._id });
  if (!patents || patents.length === 0) throw new ApiError(400, "can't get patents");

  return res.status(200)
    .json(new ApiResponse(200, patents, "here are your patents"));
});


export { uploadPatent, updatePatent, getPatentById, deletePatent, getUserPatents };