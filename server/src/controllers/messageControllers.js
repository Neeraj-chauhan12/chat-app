const { getReceiverSocketId, io } = require("../../SocketIo/server");
const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");

exports.sendMessage = async (req, res) => {
  const senderId = req.userId;
  const { id: receiverId } = req.params;
  const { message } = req.body;

  try {
    let conversation = await conversationModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    const receiverSocketId=getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage',newMessage);
    }
    return res
      .status(201)
      .json({
        message: "Message send succeessfully",
        messageData: newMessage,
        conversationId: conversation._id,
      });
  } catch (error) {
    console.log("Error in registering user", error);
    res.status(500).json({ message: "Internal Server send message Error" });
  }
};

exports.getMessages = async (req, res) => {
  const { id: chatUser } = req.params;
  const senderId = req.userId;

  try {
    const conversation = await conversationModel
      .findOne({
        members: { $all: [senderId, chatUser] },
      })
      .populate("messages");
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages=conversation.messages;
    return res
      .status(200)
      .json({ message: "Messages fetched successfully", messages });

  } catch (error) {
    console.log("Error in registering user", error);
    res.status(500).json({ message: "Internal Server get message Error" });
  }
};
