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


const allowedOrigins = [
     'http://localhost:3000', // Add this line to allow localhost during development
     'https://hike-chat-application-edi9.onrender.com' // Add your production domain here
   ];

   app.use(cors({
     origin: (origin, callback) => {
       if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true,
   }));
app.use(express.json())
app.use(cookieParser())






// routes
// initializing the API endpoints
app.use("/api/auth", authRoute)          // API for the authenticatioin user
app.use("/api/user", userRoute)          // API for the Searching user

app.use(express.static(path.join(__dirname , "/client/dist")))
app.get("*" , (req , res) =>{
     app.use(express.static(path.join(__dirname , "client" , "dist" , "index.html")))
})


// connecting to the mongodb and starting the server
connectToMongoDB().then(() => {
     // starting the server
     server.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
     }).on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
               console.error(`Port ${PORT} is already in use. Please use a different port.`);
               process.exit(1);
          } else {
               throw err;
          }
     });
})

