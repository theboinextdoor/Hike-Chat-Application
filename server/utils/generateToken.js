import jwt from "jsonwebtoken"

const generateTokenandCookies = async (tokenData ,res) => {
     try {
          const token = await jwt.sign(
               { tokenData },         //data you want to encode into the token
               process.env.JWT_SECRET_KEY,   //secret key used to sign the token
               { expiresIn: "15d" }      //  sets the expiration time for the token
          )
          const cookiesData = {
               maxAge: 15 * 24 * 60 * 60 * 1000,
               httpOnly: true,
               secure: true,
               sameSite: "strict",
          }

          res.cookie(
               "token",
               token,
               cookiesData
          );

         return token;
     } catch (error) {
          // console.error("Error in generating token", error);
          // throw error;
          return res.status(500).json({
               message : "Error in generating the token",
               error : error.message
          })
     }


}


export default generateTokenandCookies;