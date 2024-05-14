import express from "express"
import dotenv from "dotenv"
import cors from "cors"

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
     res.send("This is the Home Page for the backend")
})




app.listen(PORT , ()=>{
     // we will connect the database here
     console.log(`Server is running on port ${PORT}`);
})
