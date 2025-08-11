import mongoose , {Schema} from "mongoose";
import * as trace_events from "node:trace_events";
const userModel = new Schema({
  userName:{
    type:String,
    require:true,

  }
} , {timestamps:true})
