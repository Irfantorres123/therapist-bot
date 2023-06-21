const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const chatMessageSchema = new Schema(
  {
    feedback: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system", "function"],
      default: "user",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);
const ChatMessageModel = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = { ChatModel, ChatMessageModel };
