import mongoose , {Schema} from "mongoose";
const researchPaper = new Schema({
  title:{
    type:String,
    required:true
  },

},{timestamps:true})
