// NODE PACKAGE
import path from "path"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/userSearch.route.js"
import connectToMongoDB from "./database/connectToMogoDB.js"
import { app, server } from "./socket/user.socket.js"


const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL
const environment = process.env.NODE_ENV


// CORS options
const corsOptions = {
     origin: FRONTEND_URL, // Specify the exact origin
     credentials: true // Allow credentials (cookies, authorization headers, etc.)
 };
 
 // Middleware
 app.use(cors(corsOptions));
 app.options('*', cors(corsOptions)); // Preflight request handling for all routes
 app.use(express.json());
 app.use(cookieParser());




// Routes
app.use("/api/auth", authRoute)          // API for the authenticatioin user
app.use("/api/user", userRoute)          // API for the Searching user


if (environment === 'production') {
     app.use(express.static(path.join(__dirname, "/client/dist")))
     app.get("*", (req, res) => {
          app.use(express.static(path.join(__dirname, "client", "dist", "index.html")))
     })

} else {
     app.get("/", (req, res) => {
          res.send("Hey this webiste is not on Production Server......")
     })
}


// connecting to the mongodb and starting the server
connectToMongoDB().then(() => {
     // starting the server
     server.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
     })
})

