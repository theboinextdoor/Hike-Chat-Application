import express from "express"
import { Server } from "socket.io"
import dotenv from "dotenv"
import { createServer } from "http"
import getUserDetailsFromToken from "../utils/getUserDetailsFromToken.js";
import UserModel from "../models/auth.model.js";
import ConversationModel from "../models/conversation.model.js";
import MessageModel from "../models/message.model.js";
import getConversation from "../utils/getConversation.js"


// It creates an instance of the express module and assigns it to the app variable.
const app = express();

dotenv.config();

// Socket connection
// It creates an HTTP server using the createServer module and assigns it to the server variable.
const server = createServer(app);


console.log("Live server : ",process.env.FRONTEND_URL)



// creates an instance of the socket.io module and assigns it to the io variable
const io = new Server(server, {
     cors: {
       origin: [
         'http://localhost:3000', // Allow localhost during development
         'https://hike-chat-application-edi9.onrender.com', // Production URL
       ],
       credentials: true,
     }
   });



// It sets up a socket connection using the io instance and listens for the connection event.
const onlineUser = new Set();
io.on("connection", async (socket) => {

     // getting token from the browser
     const token = socket.handshake.auth.token;

     // getting current user details 
     const user = await getUserDetailsFromToken(token)

     // creating a room for the user 
     socket.join(user?._id?.toString())
     onlineUser.add(user?.id);

     io.emit("onlineUser", Array.from(onlineUser))


     socket.on("message-page", async (userId) => {
        
          const userDetails = await UserModel.findById(userId).select("-password");

          const payload = {
               _id: userDetails?._id,
               name: userDetails?.name,
               email: userDetails?.email,
               profile_pic: userDetails?.profile_pic,
               online: onlineUser?.has(userId)
          }
          socket.emit("message-user", payload)

          // previous msg
          const getConversationMessage = await ConversationModel.findOne({
               "$or": [
                    { sender: user?._id, receiver: userId },
                    { sender: userId, receiver: user?._id }
               ]
          }).populate('messages').sort({ updatedAt: -1 })


          socket.emit('message', getConversationMessage?.messages || [])
     })

     // new-message
     socket.on("new-message", async (data) => {
          // check conversation is availiable between both the user or not 
          let conversation = await ConversationModel.findOne({
               "$or": [
                    {
                         sender: data?.sender,
                         receiver: data?.receiver
                    },
                    {
                         sender: data?.receiver,
                         receiver: data?.sender
                    }
               ]
          })

          // if conversation is not availiable
          if (!conversation) {
               const createConversation = await ConversationModel({
                    sender: data?.sender,
                    receiver: data?.receiver
               })
               conversation = await createConversation.save();
          }

          const message = await MessageModel({
               text: data?.text,
               imageUrl: data?.imageUrl,
               videoUrl: data?.videoUrl,
               msgByUserId: data?.msgByUserId
          })
          const saveMessage = await message.save();
          const updateConversation = await ConversationModel.updateOne(
               { _id: conversation?._id },
               {
                    "$push": {
                         messages: saveMessage?._id
                    }
               })

          const getConversationMessage = await ConversationModel.findOne({
               "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender }
               ]
          }).populate('messages').sort({ updatedAt: -1 })

          io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
          io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])

          // send conversation 
          const conversationSender = await getConversation(data?.sender)
          const conversationReceiver = await getConversation(data?.receiver)

          io.to(data?.sender).emit('conversation', conversationSender)
          io.to(data?.receiver).emit('conversation', conversationReceiver)


     })

     // sidebar
     socket.on('sidebar', async (currentUserId) => {
          
          const conversation = await getConversation(currentUserId)
           socket.emit('conversation', conversation)

     })

     socket.on('seen' , async(msgByUserId)=>{

          let conversation = await ConversationModel.findOne({
               "$or": [
                    {
                         sender: user?._id,
                         receiver: msgByUserId
                    },
                    {
                         sender: msgByUserId,
                         receiver: user?._id
                    }
               ]
          })

          const conversationMessagesId = conversation?.messages || []
          const updateMessages = await MessageModel.updateMany(
               {_id : { "$in" : conversationMessagesId }, msgByUserId : msgByUserId} , 
               {"$set" : { seen : true}}
          )

           // send conversation 
           const conversationSender = await getConversation(user?._id?.toString())
           const conversationReceiver = await getConversation(msgByUserId)
 
           io.to(user?._id?.toString()).emit('conversation', conversationSender)
           io.to(msgByUserId).emit('conversation', conversationReceiver)
     })

     // disconnect
     // It sets up a listener for the disconnect event. When a client disconnects.
     socket.on("disconnect", async () => {
          onlineUser.delete(user?._id?.toString())
     })
})


// It exports the app and server variables so that they can be used in other modules.
export { app, server }

