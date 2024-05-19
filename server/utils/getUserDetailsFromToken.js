import jwt from "jsonwebtoken"
import UserModel from "../models/auth.model.js"



// THIS FILE CAN ALSO ACT AS A MIDDLEWARE BY JUST ADDING 2 MORE LINE OF CODE 
// i.e :- res.user = user 
//       next()


const getUserDetailsFromToken = async(token) =>{
     if(!token){
          // console.log("Token not provided");
          return {
               message : "Sessoin time out",
               logout : true
          }
     }

     const decodedToken =  jwt.verify(token , process.env.JWT_SECRET_KEY)
     // console.log("Decoded Token:", decodedToken);

     const user = await UserModel.findById(decodedToken.tokenData.id).select("-password")
     // console.log("User Details:", user);

     return user;
}

export default getUserDetailsFromToken;