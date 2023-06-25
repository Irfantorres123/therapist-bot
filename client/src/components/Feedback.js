import { useState } from "react";
import { Box } from "@mui/material";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

export function Feedback() {
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);

  return (
    <Box id="feedback">
      <ThumbUpAltIcon
        className="ThumbIcons"
        onClick={() => {
          if (thumbsDown) setThumbsDown(false);
          setThumbsUp((prevThumbsUp) => !prevThumbsUp);
        }}
        htmlColor={thumbsUp ? "green" : "inherit"}
        sx={{ opacity: thumbsUp ? 1 : 0.3 }}
      ></ThumbUpAltIcon>{" "}
      <ThumbDownAltIcon
        className="ThumbIcons"
        onClick={() => {
          if (thumbsUp) setThumbsUp(false);
          setThumbsDown((prevThumbsDown) => !prevThumbsDown);
        }}
        sx={{ opacity: thumbsDown ? 1 : 0.3 }}
        htmlColor={thumbsDown ? "red" : "inherit"}
      >
        {" "}
      </ThumbDownAltIcon>
    </Box>
  );
}
