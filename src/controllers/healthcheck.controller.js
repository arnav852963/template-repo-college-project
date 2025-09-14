import { asynchandler } from "../utilities/asynchandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
const  healthcheckController = asynchandler(async (req,res)=>{
  return res.status(200).json(new ApiResponse(200 , {} , "API is working fine"))

})
export {healthcheckController}