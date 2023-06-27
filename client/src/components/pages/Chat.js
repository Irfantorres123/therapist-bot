import {
  ChatContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useTheme } from "@emotion/react";
import "../../styles/Chat.css";

// import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
// import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import { TSlider } from "../TSlider";
import { TSwitch } from "../TSwitch";
import { Feedback } from "../Feedback";
export default function Chat({ data }) {
  const chat = useChat();
  const inputRef = useRef(null);
  const theme = useTheme();
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.5);
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const lg = useMediaQuery(theme.breakpoints.up("md"));
  const main = theme.palette.primary.main;
  const padding = sm ? 0 : 2;

  useEffect(() => {
    chat.onLoading(setLoading);
    chat.initialize();
  }, []);
  useEffect(() => {
    if (!loading) inputRef.current.focus();
  }, [loading]);

  return (
    <Box width="100%" height={`calc(100vh -  70px)`} display="flex">
      <Box width="20%" height="100%" display={lg ? "flex" : "none"}></Box>
      <Container
        maxWidth="md"
        sx={{ height: "100%", padding: `${padding}rem 0` }}
      >
        <Box
          height="40px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          padding="0 1rem"
        >
          {loading && <TypingIndicator />}
        </Box>
        <ChatContainer
          style={{
            backgroundColor: main,
            height: "calc(100% - 40px)",
          }}
        >
          <MessageList
            style={{
              backgroundColor: main,
            }}
          >
            {(chat.messages || []).map((message, index) => {
              const direction =
                message.role === "user" ? "outgoing" : "incoming";
              return (
                <Message
                  key={index}
                  type="custom"
                  model={{
                    position: "single",
                    direction: direction,
                  }}
                >
                  <Message.CustomContent className="message">
                    <Box
                      display="flex"
                      flexDirection="column"
                      sx={{
                        padding: "0.6em 0.9em",
                      }}
                    >
                      <Typography variant="h6" minWidth="75px" lineHeight="1">
                        {message.content}
                      </Typography>

                      {direction === "incoming" && <Feedback />}
                    </Box>
                  </Message.CustomContent>
                </Message>
              );
            })}
            {chat.streamingMessage !== "" && (
              <Message
                key={-1}
                type="custom"
                model={{
                  position: "single",
                  direction: "incoming",
                }}
              >
                <Message.CustomContent className="message">
                  <Box
                    display="flex"
                    flexDirection="column"
                    sx={{
                      padding: "0.6em 0.9em",
                    }}
                  >
                    <Typography variant="h6" minWidth="75px" lineHeight="1">
                      {chat.streamingMessage}
                    </Typography>
                  </Box>
                </Message.CustomContent>
              </Message>
            )}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            autoFocus
            attachDisabled
            disabled={loading}
            onSend={(html, message) => {
              chat.sendMessage(message, temperature, streaming);
            }}
            ref={inputRef}
            className="messageInput"
            style={{
              border: "none",
              padding: "1rem 0",
              backgroundColor: main,
            }}
          />
        </ChatContainer>
      </Container>
      <Box
        width="20%"
        height="calc(100% - 2rem)"
        display={lg ? "flex" : "none"}
        flexDirection="column"
        alignItems="center"
        sx={{
          backgroundColor: "#121212",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
        }}
        padding="1rem"
      >
        <TSlider
          label="Temperature"
          value={temperature}
          onChange={(e, value) => setTemperature(value)}
          min={0}
          max={1}
          step={0.01}
          sx={{ width: "80%", marginBottom: "1rem" }}
        />
        <TSwitch
          label="Streaming"
          value={streaming}
          onChange={(e) => setStreaming(e.target.checked)}
          color="secondary"
          sx={{ marginBottom: "1rem" }}
        />
      </Box>
    </Box>
  );
}
export function chatLoader() {
  return null;
}
