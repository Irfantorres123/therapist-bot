import React, { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import "../../styles/Login.css";

import {
  FormAlternateOption,
  FormButton,
  FormContainer,
  FormTextField,
} from "../FormElements";
import { Typography, Fade, useMediaQuery, useTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Box } from "@mui/system";
import { EmailBox } from "../EmailBox";
import { Loading } from "../Loading";
import { useHistoryNavigate } from "../../hooks";
import { LoginWithGoogle } from "../LoginWithGoogle";

export default function Login() {
  let { csrf, onAuthenticate, showSnackbar, authenticated } =
    useOutletContext();
  const [resetBoxOpen, setResetBoxOpen] = useState(false);
  const [email, setEmail] = useState("");
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  let location = useLocation();
  location.state = location.state || {};
  let { redirectPath, queryParams } = location.state;
  redirectPath = redirectPath || "/";
  let navigate = useHistoryNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.get("email"),
        password: data.get("password"),
        _csrf: csrf,
      }),
    });
    if (response.status === 200) {
      let data = await response.json();
      let jwt = data.token;
      onAuthenticate(jwt);
      let path = redirectPath + "?" + new URLSearchParams(queryParams);
      navigate(path);
    } else {
      showSnackbar("Invalid email or password", "error");
    }
  };
  useEffect(() => {
    if (authenticated) {
      navigate("/chat");
    }
  }, [authenticated]);
  if (!csrf)
    return (
      <div className="loginFormContainer">
        <Loading />
      </div>
    );
  return (
    <Box display="flex" flexDirection={sm ? "column" : "row"}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ flexGrow: "0.4" }}
        height={sm ? "20%" : "inherit"}
      >
        <Typography
          alignItems="center"
          variant="h4"
          fontSize={sm ? "1.5rem" : "3rem"}
          sx={{ color: "white", mb: "0.5rem" }}
        >
          Welcome to TherapySense
        </Typography>
        <Fade in={true} timeout={2000}>
          <Typography variant="h6" alignItems="center" sx={{ color: "white" }}>
            A journey towards mental wellness
          </Typography>
        </Fade>
      </Box>
      <FormContainer
        title="Sign In"
        onSubmit={handleSubmit}
        className="loginFormContainer"
        sx={{ flexGrow: "0.6" }}
      >
        <FormTextField
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
        />
        <FormTextField
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {/*           <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
        <LoginWithGoogle />
        <FormAlternateOption
          label="Don't have an account?"
          buttonLabel="Sign Up"
          onClick={() => {
            navigate("/register");
          }}
        />
        <FormButton text="Sign In" disabled={resetBoxOpen} />
      </FormContainer>
    </Box>
  );
}
