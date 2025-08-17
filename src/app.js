import express from "express"
import cors from "cors"
import cookie from "cookie-parser"
console.log("cors---->",process.env.CORS_ORIGIN)

const app = express();
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true

}))
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
app.use(cookie()) //global middleware hai ye.

import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users" , userRoutes)

import paperRoute from "./routes/paper.route.js";
app.use("/api/v1/papers" , paperRoute)
export {app}
