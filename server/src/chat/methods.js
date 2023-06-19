const Chat = require("../models/chat.js");
async function getChat(chatId, userId) {
  return chatId && userId
    ? await Chat.findOne({ _id: chatId, user: userId }).exec()
    : null;
}

async function createChat(userId) {
  return await Chat.create({ user: userId });
}

async function addMessage(chatId, userId, message) {
  return await Chat.updateOne(
    { _id: chatId, user: userId },
    { $push: { messages: message } }
  ).exec();
}

async function findNewChat(userId) {
  //Find chats which have lesser than 3 messages
  return await Chat.findOne({ user: userId, messages: { $size: 4 } }).exec();
}

module.exports = { getChat, createChat, addMessage, findNewChat };
