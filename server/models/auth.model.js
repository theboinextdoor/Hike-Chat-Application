import mongoose from "mongoose";


// creating the Schema
const userSchema = mongoose.Schema({
     name: {
          type: String,
          required:[true , "Enter Your name"]
     },
     email: {
          type: String,
          required:[true , "Enter Your email"],
          unique: true
          },
     password: {
          type: String,
          required:[true , "Enter Your password"]
     },
     confirmPassword : {
          type: String,
     },
     profile_pic : {
          type: String,
          default: ""
     }
}, {
     timestamps : true
})



const UserModel = mongoose.model("User" ,userSchema);



export default UserModel;