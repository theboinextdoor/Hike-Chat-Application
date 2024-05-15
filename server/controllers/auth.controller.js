import UserModel from "../models/auth.model.js";
import bcryptjs from "bcryptjs"
import generateTokenandCookies from "../utils/generateToken.js";



export const signup = async(req , res) =>{
     try {
          const {name , password ,confirmPassword,  profile_pic , email } = req.body;
          
          // check if the user is already is exist or not 
          const existingUser = await UserModel.findOne({email})
          if(existingUser){
               return res.status(401).json({
                    message : "email or User already exist",
                    error : true
               })
          }

          // check if the password is matched or not
          if(password !== confirmPassword){
               return res.status(402).json({
                    message : "Password didn't match"
               })
          }
          
          // exncrypt the password for the database
          const salt = await bcryptjs.genSalt(10)
          const hashedPassword = await bcryptjs.hash(password, salt)


          // create the user
          const newUser  = new UserModel({
               name,
               password: hashedPassword,
               profile_pic,
               email, 
          })

          const userSave =  await newUser.save();

          return res.status(200).json({
               message : "User created successfully",
               data : userSave,
               success : true
          })
     } catch (error) {
          return res.status(500).json({
               message: "Internal error in signup Controller",
               error : error.message
          })
     }
}

export const login = async(req, res) =>{
     try {
          const {email , password }= req.body;

          // check if user exists or not
          const existingUser = await UserModel.findOne({email})
          if(!existingUser){
               return res.status(404).json({
                    message : "User not found"
               })
          }
           
          // check if password is correct or not
          const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password || "")
          if(!isPasswordCorrect){
               return res.status(401).json({
                    message : "Invalid Password",
                    error: true
               })
          }

          // generating the token for the login user
          generateTokenandCookies(existingUser._id , res)

          const userData = {
               _id : existingUser._id,
               name : existingUser.name,
               email : existingUser.email,
               profile_pic : existingUser.profile_pic,
               token : req.cookies.token,
          }

          return res.status(200).json({
               message : "Login successfully",
               data : userData,
               success : true
          })
     } catch (error) {
          return res.status(500).json({
               message : "Internal error in login Controller",
               error : error.message
          })
     }
}

export const logout = (req , res) =>{
     try {
          
     } catch (error) {
          return res.status(500).json({
               message : "Internal error in logoput route",
               error : error.message,
          })
     }
}