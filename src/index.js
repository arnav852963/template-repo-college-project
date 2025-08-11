import dotenv from "dotenv"
import db from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path:'./.env'
})
db()
.then(()=>{
  //listen app
  app.listen(process.env.PORT||8000 , ()=>{
    console.log("runnin at " , process.env.PORT)
  })
  app.on("error" , (error)=>{
    console.log("error in app.on" , error)
    throw error
  })

})
.catch((e)=>{
  console.log("errror--->>>>" , e)
})

