const express = require("express");
const { authenticate } = require("../middleware/authenticator");
var router = express.Router();
const createError = require("http-errors");
const { Configuration, OpenAIApi } = require("openai");
const {
  getChat,
  addMessage,
  createChat,
  findNewChat,
} = require("../chat/methods");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.get("/csrf", (req, res, next) => {
  try {
    res.json({ csrf: req.csrfToken() });
  } catch (err) {
    next(createError(500, `Error while getting csrf:`));
  }
});
router.post("/createChat", authenticate, async (req, res, next) => {
  try {
    let newChat = await findNewChat(req.user._id);
    if (newChat) {
      res.json({ chatId: newChat._id });
      return;
    }
    let chat = await createChat(req.user._id);
    chat.messages = [
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
    await chat.save();
    res.json({ chatId: chat._id });
  } catch (err) {
    next(createError(500, `Error while creating chat:`));
  }
});
router.post("/sendMessage", authenticate, async (req, res, next) => {
  try {
    let message = { role: "user", content: req.body.content };
    await addMessage(req.body.chatId, req.user._id, message);
    let chat = await getChat(req.body.chatId, req.user._id);
    let messages = chat.messages.map((message) => {
      return { content: message.content, role: message.role };
    });
    let response = Buffer.from("");
    let resultStream = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        stream: true,
        temperature: req.body.temperature || 0.5,
      },
      { responseType: "stream" }
    );

    resultStream.data.on("data", async (result) => {
      response += result;
      res.write(result);
    });
    resultStream.data.on("error", (err) => {
      next(createError(500, `Error while sending message: `));
    });
    resultStream.data.on("end", async () => {
      response = response.toString();
      text = "";
      response
        .split("\n")
        .filter((line) => line.trim() !== "")
        .forEach((line) => {
          line = line.slice(5);
          if (line.trim() === "[DONE]") return;
          JSON.parse(line).choices.forEach((choice) => {
            if (choice.index === 0) {
              if (choice.finish_reason === "stop") {
                return;
              }
              text += choice.delta.content;
            }
          });
        });
      let message = { role: "assistant", content: text };
      await addMessage(chat._id, req.user._id, message);
      res.end();
    });
  } catch (err) {
    next(createError(500, `Error while sending message:`));
  }
});

module.exports = router;
