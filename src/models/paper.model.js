import mongoose , {Schema} from "mongoose";
import { strict } from "node:assert";
import { stringify } from "node:querystring";
const researchPaper = new Schema({
  title:{
    type:String,
    required:true
  },
authors:[{
    type:String,
  required:true
}],
  link:{
    type:String,
    required:true
  },
  manualUpload:{
    type:String,

  },
  tag:{
    type:String
  },
  publishedDate:{
    type:String,
    required:true
  },
  publishedBy:{
    type:String,
    required:true
  },
  citedBy:{
    type:Number,

  },
  pdfUrl:{
    type:String,

  },
  source:{
    type:String,
    default:"manual"
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  }

},{timestamps:true})
export const Paper = mongoose.model("Paper" , researchPaper )