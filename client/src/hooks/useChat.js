import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export function useChat() {
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState([]); // [{role: "user", content: "hello"}, {role: "assistant", content: "hi"}]
  const [streamingMessage, setStreamingMessage] = useState("");
  const { csrf, authToken, showSnackbar } = useOutletContext();
  const [onLoadingCallback, setOnLoadingCallback] = useState(() => () => {});
  const initialize = async () => {
    onLoadingCallback(true);
    const res = await fetch("/api/getChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (res.status !== 200) {
      showSnackbar("An error occured", "error");
      return;
    }
    const data = await res.json();
    setChatId(data.chatId);
    onLoadingCallback(false);
  };
  const generateRandomId = () => {
    return Math.random().toString(16).slice(2);
  };
  const processChunkedResponse = (response) => {
    var reader = response.body.getReader();
    var decoder = new TextDecoder();
    var text = "";
    return readChunk();

    function readChunk() {
      return reader.read().then(appendChunks);
    }

    function appendChunks(result) {
      var chunk = decoder.decode(result.value || new Uint8Array(), {
        stream: !result.done,
      });
      chunk
        .split("\n")
        .filter((line) => line.trim() !== "")
        .forEach((line) => {
          line = line.slice(5);
          if (line.trim() === "[DONE]") return text;
          JSON.parse(line).choices.forEach((choice) => {
            if (choice.index === 0) {
              if (choice.finish_reason === "stop") {
                return;
              }
              text += choice.delta.content || "";
            }
          });
        });
      setStreamingMessage((prev) => text);
      if (result.done) {
        return text;
      } else {
        return readChunk();
      }
    }
  };
  const sendMessage = async (message, temperature = 0, stream = false) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);
    onLoadingCallback(true);
    fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ content: message, chatId, temperature, stream }),
    })
      .then(
        stream
          ? processChunkedResponse
          : async (res) => {
              return { status: res.status, json: await res.json() };
            }
      )
      .then(async (message) => {
        if (!stream) {
          if (message.status !== 200) {
            throw new Error("An error occured");
          }
          message = message.json.content;
        }
        onLoadingCallback(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: message,
          },
        ]);
        setStreamingMessage((prev) => "");
      })
      .catch((err) => {
        onLoadingCallback(false);
        setStreamingMessage((prev) => "");
        console.log(err, stream);
        showSnackbar("An error occured", "error");
      });
  };

  const onLoading = (callback) => {
    setOnLoadingCallback(() => callback);
  };
  const fetchHistory = async () => {
    const res = await fetch("/api/getMessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ chatId }),
    });
    if (res.status !== 200) {
      showSnackbar("An error occured while fetching history", "error");
      return;
    }
    const data = await res.json();
    setMessages((messages) => [...messages, ...data.messages]);
  };
  useEffect(() => {
    if (chatId) {
      fetchHistory();
    }
  }, [chatId]);

  return { sendMessage, onLoading, messages, streamingMessage, initialize };
}
