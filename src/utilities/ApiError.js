class ApiError extends Error{
  constructor(
    statuscode,
    message="error occured",
    errors=[],
    stack=""
  ) {
    super(message)
    this.statuscode = statuscode
    this.data =null
    this.message =message
    this.success =false
    this.errors=errors
    if (!stack)    Error.captureStackTrace(this , this.constructor)
    else this.stack=stack
  }
}
export {ApiError}