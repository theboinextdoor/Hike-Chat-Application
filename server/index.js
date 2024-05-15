// NODE PACKAGE
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"

// MONGODB CONNECTION FILE
import connectToMongoDB from "./database/connectToMogoDB.js"

// initialzing the dotenv configuration to fetch the environmental variable
dotenv.config();

// initializing all the essentilas for the backend server
const app = express();    
const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(express.json())
app.use(cookieParser())



// routes
app.get("/" , (req , res) =>{
     res.send("Hey there i am the home page ")
})


// initializing the API endpoints
app.use("/api/auth" , authRoute)          // API for the authenticatioin user



// connecting to the mongodb and starting the server
connectToMongoDB().then(() =>{
     // starting the server
     app.listen(PORT , ()=>{        
          console.log(`Server is running on port ${PORT}`);
     })     
})

