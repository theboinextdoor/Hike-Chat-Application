import express from "express";
import searchUser from "../controllers/userSearch.controller.js";


// initializing the routing process
const router = express();

// search routes
router.post("/search-user" , searchUser)


export default router;