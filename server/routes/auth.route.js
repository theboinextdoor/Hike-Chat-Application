import express from "express"
import { login, logout, signup } from "../controllers/auth.controller.js";

// initializing the routing process
const router = express();

// signup route
router.post("/signup" , signup);

// login route
router.post("/login" , login);

// logout route
router.post("/logout" , logout);


export default router;
