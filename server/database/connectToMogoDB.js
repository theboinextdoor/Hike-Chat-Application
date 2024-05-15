import mongoose from "mongoose";

const connectToMongoDB = async () => {
     try {
          await mongoose.connect(process.env.MONGO_DB_URI)
          console.log("Connected to the database")
     } catch (error) {
          console.log("Error connecting the MongoDB", error)
     }
}


export default connectToMongoDB; 
