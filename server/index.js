// NODE PACKAGE
import path from "path"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/userSearch.route.js"
import { app, server } from "./socket/user.socket.js"

// MONGODB CONNECTION FILE
import connectToMongoDB from "./database/connectToMogoDB.js"

// initialzing the dotenv configuration to fetch the environmental variable
dotenv.config();

// initializing all the essentilas for the backend server
// const app = express();
const PORT = process.env.PORT || 3000;
console.log("Port number : ", process.env.PORT)

app.use(cors({
     origin: 'http://localhost:3000', // Replace with your frontend domain
     credentials: true,
}))
app.use(express.json())
app.use(cookieParser())






// routes
// initializing the API endpoints
app.use("/api/auth", authRoute)          // API for the authenticatioin user
app.use("/api/user", userRoute)          // API for the Searching user


// Deploying starts here

const __dirname = path.resolve();
const environment = process.env.NODE_ENV;
console.log("Environment Production : ",environment)
if (environment === "production") {
     // Serve static files from the React app
    
     app.use(express.static(path.join(__dirname, "/client/dist")));
     
     // Handle React routing, return all requests to React app
     app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
     });
} else {
     app.get("/", (req, res) => {
          res.send("API is running Succcessfully......")
     })

}

// Deploying ends here


// connecting to the mongodb and starting the server
connectToMongoDB().then(() => {
     // starting the server
     server.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
     })
})

