import mongoose,{Schema} from "mongoose";

const starModel = new Schema({
  paper:{
    type:Schema.Types.ObjectId,
    ref:"Paper"
  },
  staredBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})

console.log(typeof starModel)

export const Star = mongoose.model("Star" , starModel)
