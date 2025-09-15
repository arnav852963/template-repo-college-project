import Mailgen from "mailgen";

// Configure mailgen by setting a theme and your product info
const mailgen = (username , verificationUrl) => {
  return{
    body:{
      name: username,
      intro: "Welcome to ResearchHub! We're very excited to have you on board.",
      action:{
        instructions:"To verify your account, please click here:",
        button:{
          color:"#22BC66", // Optional action button color
          text:"Confirm your account",
          link:verificationUrl
        }
      },
      outro:"Need help, or have questions? Just reply to this email, we'd love to help."
      }
    }
  }

const forgotPassword = (username , forgotPasswordUrl) => {
  return{
    body:{
      name: username,
      intro: "Welcome to ResearchHub! We're very excited to have you on board.",
      action:{
        instructions:"To reset your password, please click here:",
        button:{
          color:"#22BC66", // Optional action button color
          text:"Confirm your account",
          link:forgotPasswordUrl
        }
      },
      outro:"Need help, or have questions? Just reply to this email, we'd love to help."
    }
  }
}
export {mailgen,forgotPassword}