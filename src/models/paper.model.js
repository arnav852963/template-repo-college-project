import mongoose , {Schema} from "mongoose";
const researchPaper = new Schema({
  title:{
    type:String,
    required:true
  },
author:{
    type:String,
  required:true
},
  link:{
    type:String,
    required:true
  },
  manualUpload:{
    type:String,

  },
  publishedDate:{
    type:String,
    required:true
  },
  source:{
    type:String,
    default:"manual"
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }

},{timestamps:true})
export const Paper = mongoose.model("Paper" , researchPaper )