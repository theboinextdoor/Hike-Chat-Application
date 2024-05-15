import express from "express"
import { login, logout, signup, updateUserDetails, userDetails } from "../controllers/auth.controller.js";


// initializing the routing process
const router = express();

// signup route
router.post("/signup" , signup);

// login route
router.post("/login" , login);

// logout route
router.get("/logout" , logout);

// get details route
router.get("/user-details" , userDetails)

// update the user details 
router.post("/update-user" , updateUserDetails)


export default router;
