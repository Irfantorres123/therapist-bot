import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { FormButtonStyles, FormContainerStyles } from "../styles/Form";
import "../styles/Form.css";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FormButtonProps, FormTextFieldProps } from "../styles/Props";
import { useRef } from "react";
import { blue } from "@mui/material/colors";

export function FormContainer(props) {
  const { children, title, onSubmit, className, ...other } = props;
  return (
    <Container component="main" maxWidth="xs" className={className} {...other}>
      <CssBaseline />
      <Box sx={FormContainerStyles()}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h6"
          fontWeight="500"
          fontSize="1.25rem"
        >
          {title}
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          {children}
        </Box>
      </Box>
    </Container>
  );
}

export function FormTextField(props) {
  const { children, ...other } = props;
  return <TextField {...FormTextFieldProps()} {...other} />;
}

export function FormButton(props) {
  const { text, sx, ...other } = props;
  return (
    <Box className="form-button-box">
      <Button
        className="form-button"
        sx={{ ...FormButtonStyles(), ...sx }}
        {...FormButtonProps()}
        {...other}
      >
        {text}
      </Button>
    </Box>
  );
}

export function FormAlternateOption(props) {
  const { label, onClick, buttonLabel } = props;
  return (
    <Box display="inline-flex" margin="1rem 0">
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          fontWeight: 500,
          display: "inline",
          marginRight: buttonLabel ? "0.5rem" : 0,
        }}
      >
        {label}
      </Typography>
      <Box display="inline-flex" onClick={onClick}>
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 500,

            textDecoration: "underline",
            ":hover": { cursor: "pointer", color: blue[400] },
          }}
        >
          {buttonLabel}
        </Typography>
      </Box>
    </Box>
  );
}
