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
  isPublished:{
    type:Boolean,
    default:true

  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  isManual:{
    type:Boolean,
    required:true,
    default:false
  }

},{timestamps:true})
export const Paper = mongoose.model("Paper" , researchPaper )