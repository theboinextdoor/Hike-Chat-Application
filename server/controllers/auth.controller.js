import UserModel from "../models/auth.model.js";
import bcryptjs from "bcryptjs"
import generateTokenandCookies from "../utils/generateToken.js";
import getUserDetailsFromToken from "../utils/getUserDetailsFromToken.js"


export const signup = async (req, res) => {
     try {
          const { name, password, confirmPassword, profile_pic, email } = req.body;

          // check if the user is already is exist or not 
          const existingUser = await UserModel.findOne({ email })
          if (existingUser) {
               return res.status(401).json({
                    message: "email or User already exist",
                    error: true
               })
          }

          // check if the password is matched or not
          if (password !== confirmPassword) {
               return res.status(402).json({
                    message: "Password didn't match"
               })
          }

          // exncrypt the password for the database
          const salt = await bcryptjs.genSalt(10)
          const hashedPassword = await bcryptjs.hash(password, salt)


          // create the user
          const newUser = new UserModel({
               name,
               password: hashedPassword,
               profile_pic,
               email,
          })

          //     if user is successfully created in Database 
          if (newUser) {
               await generateTokenandCookies(newUser._id, res)

               await newUser.save();
               res.status(200).json({
                    message: "Sign up successfully",
                    data: {
                         _id: newUser._id,
                         name: newUser.name,
                         profile_pic: newUser.profile_pic,
                         email: newUser.email
                    },
                    success: true
               })
          } else {
               return res.status(500).json({
                    message: "Invalid User Data ",
                    error: error.message
               })
          }

     } catch (error) {
          return res.status(500).json({
               message: "Internal error in signup Controller",
               error: error.message
          })
     }
}

export const login = async (req, res) => {
     try {
          const { email, password } = req.body;

          // check if user exists or not
          const existingUser = await UserModel.findOne({ email })
          if (!existingUser) {
               return res.status(404).json({
                    message: "User not found"
               })
          }

          // check if password is correct or not
          const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password || "")
          if (!isPasswordCorrect) {
               return res.status(401).json({
                    message: "Invalid Password",
                    error: true
               })
          }

          // generating the token for the login user
          const tokenData = {
               id: existingUser._id,
               email: existingUser.email,

          }
          const token = await generateTokenandCookies(tokenData, res)
          // console.log("Generated Token", token);

          // user details 
          const userData = {
               _id: existingUser._id,
               name: existingUser.name,
               email: existingUser.email,
               profile_pic: existingUser.profile_pic,
          }

          return res.status(200).json({
               message: "Login successfully",
               data: {
                    userData,
                    token: token
               },
               success: true,

          })
     } catch (error) {
          return res.status(500).json({
               message: "Internal error in login Controller",
               error: error.message
          })
     }
}

export const logout = (req, res) => {
     try {
          res.cookie(
               "token",
               "",
               {
                    maxAge: 0,
               }
          )

          return res.status(200).json({
               message: "Logout successfully",
               success: true
          })
     } catch (error) {
          return res.status(500).json({
               message: "Internal error in logout route",
               error: error.message,
          })
     }
}

export const userDetails = async (req, res) => {
     try {
          const token = req.cookies.token || "";
          // console.log("This is the UserDetails Token : ", req.cookies.token)


          const user = await getUserDetailsFromToken(token);
          if (!user) {
               return res.status(404).json({
                    message: "User not found"
               });
          }

          return res.status(200).json({
               message: "User details",
               data: user,
          })
     } catch (error) {
          return res.status(500).json({
               message: "Internal error in updateUserDetails",
               error: error.message
          });
     }
}

export const updateUserDetails = async (req, res) => {
     try {
          const token = req.cookies.token || "";
          
          const user = await getUserDetailsFromToken(token)
          
          const { name, profile_pic } = req.body;
          // Find the user by ID and update the name and profile picture
          const updatedUser = await UserModel.findByIdAndUpdate(
               user,
               {
                    name: name,
                    profile_pic: profile_pic
               },
               { new: true }
          );

          if (!updatedUser) {
               return res.status(404).json({
                    message: "User not found"
               })
          }

          return res.status(200).json({
               message: "User details updated successfully",
               data: updatedUser,
               success: true
          });
     } catch (error) {
          return res.status(500).json({
               message: " Internal error in Update User Details",
               error: error.message,
          })
     }
}
