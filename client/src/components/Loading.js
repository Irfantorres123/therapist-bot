import { TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { Box } from "@mui/material";

export function Loading() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <TypingIndicator content="Loading" />
    </Box>
  );
}
