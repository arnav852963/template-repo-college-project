const asynchandler = (func) =>{
  return async (req , res , next)=>{
    try {
      const res= await func(req,res,next )
      return res
    } catch (e){
      console.log("error in asynchandler" , e)
      let statusCode =0
      if (e.code>=100 && e.code<= 1000) statusCode =e.code
      else statusCode=500
      res.status(statusCode).json({
        success:false,
        message:e.message
      })

    }
  }
}
export {asynchandler}