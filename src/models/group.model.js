import mongoose , {Schema} from "mongoose";

const groupModel = new Schema({
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  papers:[{
    type:Schema.Types.ObjectId,
    ref:"Paper"
  },],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})

export const Group = mongoose.model("Group" , groupModel)