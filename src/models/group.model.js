import mongoose , {Schema} from "mongoose";

const groupModel = new Schema({
  name:{
    Type:String,
    required:true
  },
  description:{
    Type:String,
    required:true
  },
  paper:[{
    type:Schema.Types.ObjectId,
    ref:"Paper"
  }]
},{timestamps:true})

export const Group = mongoose.model("Group" , groupModel)