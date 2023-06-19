import { Backdrop, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FormTextField } from "./FormElements";

export function EmailBox(props) {
  const {
    open,
    label,
    error,
    onSubmit,
    onClose,
    buttonLabel,
    disabled,
    extraLabel,
    extraLabel2,
  } = props;
  const [email, setEmail] = useState("");
  useEffect(() => {
    setEmail("");
  }, [open]);
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "#F5F6F799",
      }}
    >
      <Box
        minWidth="350px"
        maxWidth="350px"
        backgroundColor="white"
        display="flex"
        flexDirection="column"
        borderRadius="0.5rem"
        overflow="hidden"
        boxShadow="0px 0px 20px 0px #e7e7e7"
      >
        <Box>
          <Box display="flex" flexDirection="column" marginBottom="2rem">
            <Typography
              variant="h6"
              fontSize="1.25rem"
              fontWeight="500"
              padding="0.5rem 1rem"
            >
              {label}
            </Typography>
            <Box
              display="block"
              height="1px"
              borderRadius="2px"
              marginLeft="1rem"
              sx={{ backgroundColor: "#dadce0" }}
            />
            <Box padding="0.5rem 1rem">
              <FormTextField
                variant="standard"
                label="Email address"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required={false}
                error={error}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                setEmail("");
                await onSubmit(email);
              }}
              sx={{
                margin: "0.5rem 1rem",
              }}
              disabled={disabled}
            >
              <Typography
                variant="h7"
                sx={{
                  fontFamily: "Glory",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {buttonLabel}
              </Typography>
            </Button>
          </Box>
          {extraLabel && (
            <Box
              display="flex"
              flexDirection="column"
              marginBottom="2rem"
              margin="1rem"
            >
              <Typography variant="h6" sx={{ color: error ? "red" : "green" }}>
                {extraLabel}
              </Typography>
              <Typography variant="h6">{extraLabel2}</Typography>
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            setEmail("");
            onClose();
          }}
          sx={{
            margin: "10px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Close
          </Typography>
        </Button>
      </Box>
    </Backdrop>
  );
}
