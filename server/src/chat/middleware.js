const { addMessage } = require("./methods");

function stream(req, chat, data, res) {
  let response = Buffer.from("");
  data.on("data", async (result) => {
    response += result;
    res.write(result);
  });
  data.on("error", (err) => {
    next(createError(500, `Error while sending message: `));
  });
  data.on("end", async () => {
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
}

module.exports = { stream };
