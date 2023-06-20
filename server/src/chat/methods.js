const { ChatModel: Chat, ChatMessageModel } = require("../models/chat.js");
async function getChat(chatId, userId) {
  return chatId && userId
    ? await Chat.findOne({ _id: chatId, user: userId }).exec()
    : null;
}

async function createChat(userId) {
  return await Chat.create({ user: userId });
}

async function addMessage(chatId, userId, message) {
  return await ChatMessageModel.create({
    chat: chatId,
    user: userId,
    role: message.role,
    content: message.content,
  });
}

async function getAllMessages(chatId) {
  return await ChatMessageModel.find({ chat: chatId })
    .sort({ createdAt: 1 })
    .exec();
}

async function findChat(userId) {
  return await Chat.findOne({ user: userId }).exec();
}

module.exports = { getChat, createChat, addMessage, findChat, getAllMessages };
