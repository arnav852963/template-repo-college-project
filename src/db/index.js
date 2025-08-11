import mongoose from "mongoose";
import {DB_NAME} from "../../constants.js";
import dotenv from "dotenv"
dotenv.config({
  path:'./.env'
})
console.log(process.env.MONGODB_URL)
const db = async ()=>{
  try{
    const mongo = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log("connected to mongodb--->" , mongo.connection.host)
  } catch (e){
    console.log("error in mongo connection" , e.message)
    process.exit(1)
  }
}
export default db