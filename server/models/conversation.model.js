import mongoose from "mongoose";

// creating the conversation schema
const conversationSchema = mongoose.Schema({
     sender :{
          type : mongoose.Schema.ObjectId,
          required : true, 
          ref : "User"
     },
     receiver : {
          type: mongoose.Schema.ObjectId,
          required : true,
          ref : "User"
     },
     messages : [
          {
               type: mongoose.Schema.ObjectId,
               ref : "Message"
          }
     ]
},{
     timestamps : true
})

// creating the conversation model
const ConversationModel = mongoose.model("Conversation" , conversationSchema);


export default ConversationModel;