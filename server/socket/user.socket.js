import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { createServer } from "http";
import getUserDetailsFromToken from "../utils/getUserDetailsFromToken.js";
import UserModel from "../models/auth.model.js";
import ConversationModel from "../models/conversation.model.js";
import MessageModel from "../models/message.model.js";
import getConversation from "../utils/getConversation.js";

dotenv.config();

// Initialize express app
const app = express();
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

// Store online users
const onlineUser = new Set();

// Socket connection
io.on("connection", async (socket) => {
    try {
        const token = socket.handshake.auth.token;
        const user = await getUserDetailsFromToken(token);
        
        if (!user) {
            socket.disconnect();
            return;
        }

        const userId = user._id.toString();
        socket.join(userId);
        onlineUser.add(userId);

        io.emit("onlineUser", Array.from(onlineUser));

        socket.on("message-page", async (targetUserId) => {
            try {
                const payload = await getUserPayload(targetUserId);
                socket.emit("message-user", payload);

                const conversationMessages = await getConversationMessages(userId, targetUserId);
                socket.emit('message', conversationMessages);
            } catch (error) {
                console.error("Error in message-page:", error);
            }
        });

        socket.on("new-message", async (data) => {
            try {
                const { sender, receiver, text, imageUrl, videoUrl, msgByUserId } = data;
                let conversation = await findOrCreateConversation(sender, receiver);

                const message = await saveMessage({ text, imageUrl, videoUrl, msgByUserId });
                await updateConversation(conversation._id, message._id);

                const updatedMessages = await getConversationMessages(sender, receiver);
                io.to(sender).emit('message', updatedMessages);
                io.to(receiver).emit('message', updatedMessages);

                await updateConversationsForUsers(sender, receiver);
            } catch (error) {
                console.error("Error in new-message:", error);
            }
        });

        socket.on('sidebar', async (currentUserId) => {
            try {
                const conversation = await getConversation(currentUserId);
                socket.emit('conversation', conversation);
            } catch (error) {
                console.error("Error in sidebar:", error);
            }
        });

        socket.on('seen', async (msgByUserId) => {
            try {
                await markMessagesAsSeen(userId, msgByUserId);
                await updateConversationsForUsers(userId, msgByUserId);
            } catch (error) {
                console.error("Error in seen:", error);
            }
        });

        socket.on("disconnect", () => {
            onlineUser.delete(userId);
            io.emit("onlineUser", Array.from(onlineUser));
        });

    } catch (error) {
        console.error("Error in connection:", error);
        socket.disconnect();
    }
});

// Helper Functions
const getUserPayload = async (userId) => {
    const userDetails = await UserModel.findById(userId).select("-password");
    return {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(userId)
    };
};

const getConversationMessages = async (userId1, userId2) => {
    const conversation = await ConversationModel.findOne({
        "$or": [
            { sender: userId1, receiver: userId2 },
            { sender: userId2, receiver: userId1 }
        ]
    }).populate('messages').sort({ updatedAt: -1 });
    return conversation?.messages || [];
};

const findOrCreateConversation = async (sender, receiver) => {
    let conversation = await ConversationModel.findOne({
        "$or": [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    });
    if (!conversation) {
        conversation = new ConversationModel({ sender, receiver });
        conversation = await conversation.save();
    }
    return conversation;
};

const saveMessage = async (messageData) => {
    const message = new MessageModel(messageData);
    return await message.save();
};

const updateConversation = async (conversationId, messageId) => {
    await ConversationModel.updateOne(
        { _id: conversationId },
        { "$push": { messages: messageId } }
    );
};

const updateConversationsForUsers = async (userId1, userId2) => {
    const conversationSender = await getConversation(userId1);
    const conversationReceiver = await getConversation(userId2);

    io.to(userId1).emit('conversation', conversationSender);
    io.to(userId2).emit('conversation', conversationReceiver);
};

const markMessagesAsSeen = async (userId, msgByUserId) => {
    const conversation = await ConversationModel.findOne({
        "$or": [
            { sender: userId, receiver: msgByUserId },
            { sender: msgByUserId, receiver: userId }
        ]
    });
    const conversationMessagesId = conversation?.messages || [];
    await MessageModel.updateMany(
        { _id: { "$in": conversationMessagesId }, msgByUserId },
        { "$set": { seen: true } }
    );
};

export { app, server };
