const express = require("express");
const { authenticate } = require("../middleware/authenticator");
var router = express.Router();
const createError = require("http-errors");
const { Configuration, OpenAIApi } = require("openai");
const {
  getChat,
  addMessage,
  createChat,
  findChat,
  getAllMessages,
} = require("../chat/methods");
const { stream } = require("../chat/middleware");
const { getInitialPrompt } = require("../chat/prompt");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.get("/csrf", (req, res, next) => {
  try {
    res.json({ csrf: req.csrfToken() });
  } catch (err) {
    next(createError(500, `Error while getting csrf:  ${err.message}`));
  }
});
router.post("/getChat", authenticate, async (req, res, next) => {
  try {
    let existingChat = await findChat(req.user._id);
    if (existingChat) {
      res.json({ chatId: existingChat._id });
      return;
    }
    let chat = await createChat(req.user._id);
    let messages = [
      { role: "system", content: getInitialPrompt(req.user.name) },
    ];
    for (let i = 0; i < messages.length; i++) {
      await addMessage(chat._id, req.user._id, messages[i]);
    }
    res.json({ chatId: chat._id });
  } catch (err) {
    next(createError(500, `Error while creating chat:  ${err.message}`));
  }
});

router.post("/getMessages", authenticate, async (req, res, next) => {
  try {
    let { chatId } = req.body;
    let chat = await getChat(chatId, req.user._id);
    if (!chat) {
      res.json({ messages: [] });
      return;
    }
    let messages = await getAllMessages(chatId);
    messages = messages.filter((message) => message.role !== "system");
    res.json({
      messages,
    });
  } catch (err) {
    next(createError(500, `Error while getting messages:  ${err.message}`));
  }
});

router.post("/sendMessage", authenticate, async (req, res, next) => {
  try {
    let { chatId } = req.body;
    let message = { role: "user", content: req.body.content };
    await addMessage(chatId, req.user._id, message);
    let chat = await getChat(chatId, req.user._id);
    let messages = await getAllMessages(chatId);
    messages = messages.map((message) => {
      return {
        role: message.role,
        content: message.content,
      };
    });
    let result = await openai.createChatCompletion(
      {
        model: process.env.LANGUAGE_MODEL,
        messages: messages,
        stream: req.body.stream ? true : false,
        temperature: req.body.temperature || 0.5,
      },
      { responseType: req.body.stream ? "stream" : "text" }
    );

    if (req.body.stream) {
      stream(req, chat, result.data, res);
    } else {
      const message = await addMessage(chatId, req.user._id, {
        role: "assistant",
        content: result.data.choices[0].message.content,
      });
      res.json({
        content: result.data.choices[0].message.content,
        id: message._id,
      });
      next();
    }
  } catch (err) {
    req.log = {
      usage: err.data?.usage,
      email: req.user.email,
      rate: {
        remainingTokens: (err.headers || {})["x-ratelimit-remaining-tokens"],
        remainingRequests: (err.headers || {})[
          "x-ratelimit-remaining-requests"
        ],
      },
    };
    next(createError(500, `Error while sending message: ${err.message}`));
  }
});

module.exports = router;
