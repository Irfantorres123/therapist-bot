import React from "react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useHistoryNavigate } from "../../hooks";
import "../../styles/Login.css";

import {
  FormAlternateOption,
  FormButton,
  FormContainer,
  FormTextField,
} from "../FormElements";
import { Loading } from "../Loading";
import { LoginWithGoogle } from "../LoginWithGoogle";

export default function Register() {
  let { onAuthenticate, csrf, showSnackbar } = useOutletContext();
  let [error, setError] = useState(false);
  let navigate = useHistoryNavigate();
  if (!csrf)
    return (
      <div className="loginFormContainer">
        <Loading />
      </div>
    );

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      if (data.get("password") !== data.get("confirm-password")) {
        setError(true);
        showSnackbar("Passwords do not match", "error");
        return false;
      }

      let postData = {
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
        _csrf: csrf,
      };
      let response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        let data = await response.json();
        let jwt = data.token;
        onAuthenticate(jwt);
        navigate("/");
      } else if (response.status === 504) {
        showSnackbar("Can't reach server", "error");
      } else {
        let body = await response.json();
        showSnackbar(body.error, "error");
      }
    } catch (e) {
      showSnackbar("Error registering", "error");
    }
  };

  return (
    <FormContainer title="Register" onSubmit={handleSubmit}>
      <FormTextField
        id="name"
        label="Name"
        name="name"
        autoComplete="new-name"
        autoFocus
      />
      <FormTextField
        id="email"
        label="Email"
        name="email"
        autoComplete="new-email"
      />
      <FormTextField
        error={error}
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
      />
      <FormTextField
        error={error}
        name="confirm-password"
        label="Confirm Password"
        type="password"
        id="confirm-password"
        autoComplete="confirm-password"
      />
      <LoginWithGoogle />

      {/*           <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
      <FormAlternateOption
        label="Already have an account?"
        buttonLabel="Login"
        onClick={() => {
          navigate("/login");
        }}
      />
      <FormButton text="Register" />
    </FormContainer>
  );
}
