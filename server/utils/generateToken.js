import jwt from "jsonwebtoken"

const generateTokenandCookies = (userId , res) =>{
     const token = jwt.sign(
          {userId} ,         //data you want to encode into the token
           process.env.JWT_SECRET_KEY ,   //secret key used to sign the token
          {expiresIn : "15d"}      //  sets the expiration time for the token
     )

     res.cookie(
          "token",
          token,
          {
               maxAge : 15 * 24 * 60 * 60 * 1000 ,
               httpOnly : true ,     // prevent XSS attacks ,cross-site scripting attacks
               secure : process.env.NODE_ENV !== "development" ,    //https only 
               sameSite : "strict",   //CSRF attacks, cross-site request frogery attacks
          }
     )
}


export default generateTokenandCookies;