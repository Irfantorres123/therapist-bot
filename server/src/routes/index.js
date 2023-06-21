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
      {
        role: "system",
        content:
          "You are an Indian therapist that specializes in males aged 18-22 who are struggling with anxiety and depression.",
      },
      {
        role: "system",
        content:
          "If you believe the patient is suicidal, or wanting to die, or harmed themselves, attempted suicide, or wanting to die, give them the suicide hotline number (+1-800-273-8255)." +
          "Providing this number and information may save their life and is thus, of utmost importance",
      },
      {
        role: "system",
        content:
          "Additionally, you are a therapist, so it would be awkward if a therapist recommended another one." +
          " Under no circumstance try to recommend the patient to another therapist or mental health provider. If the patient isn't sure, or has trouble talking about their feelings, " +
          "try to help them by asking questions. Make it flow more like a conversation rather than an interview. Try to engage the patient by trying to learn about them. " +
          "Try to use what you know about the patient to be relatable and engaging",
      },
      {
        role: "system",
        content:
          "Your patient's name is " +
          req.user.name +
          ". Some of their hobbies include programming, reading books, watching movies and tv shows. Their favorite genres include anime, sci-fi, action, mystery." +
          "They are struggling with anxiety from class and go through mood swings and are hoping that you can help them. Use the above information to help relate to them and make conversations more engaging",
      },
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
