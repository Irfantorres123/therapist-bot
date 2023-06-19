import { Alert, Box, Snackbar, Typography } from "@mui/material";
import ResponsiveAppBar, { NavigationBar } from "./NavigationBar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPages } from "../pages";
import jwt from "jsonwebtoken";
import { useHistoryNavigate } from "../hooks";
import { requireAuth } from "../requireAuth";

export default function Root() {
  const [data, setData] = useState(null);
  let [user, setUser] = useState(null);
  let [snackBarOpen, setSnackBarOpen] = useState(false);
  let [snackBarMessage, setSnackBarMessage] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  let [severity, setSeverity] = useState("success");

  let [authToken, setAuthToken] = useState(localStorage.getItem("jwt"));
  let [csrf, setCsrf] = useState(false);
  let location = useLocation();
  const navigate = useHistoryNavigate();
  const reauthenticate = () => {
    localStorage.removeItem("jwt");
    setAuthenticated(false);
    if (requireAuth(location.pathname)) navigate("/login", { replace: true });
  };
  const checkJWT = () => {
    let storedJwt = localStorage.getItem("jwt");
    if (storedJwt === null) {
      reauthenticate();
      return;
    }
    let decoded = jwt.decode(storedJwt);
    if (decoded === null) {
      reauthenticate();
      return;
    }
    let expiry = decoded.exp;
    if (Date.now() / 1000 > expiry) {
      navigate("/logout", { replace: true });
      return;
    }
    user = { ...decoded, name: decoded.name || "Unknown" };
    setUser(user);
    setAuthenticated(true);
  };
  const onAuthenticate = (jwt) => {
    localStorage.setItem("jwt", jwt);
    checkJWT();
    setAuthToken(jwt);
  };
  const showSnackbar = (message, severity) => {
    setSeverity(severity);
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };
  const fetchCSRFToken = async () => {
    const res = await fetch("/api/csrf", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      res.json().then((data) => {
        setCsrf(data.csrf);
      });
    } else if (res.status === 504) {
      showSnackbar("cant reach server");
    }
  };
  const onLogout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setAuthToken(null);
    setAuthenticated(false);
  };
  const closeSnackBar = () => {
    setSnackBarOpen(false);
  };
  useEffect(() => {
    checkJWT();
    setData({ pages: getPages() });
    fetchCSRFToken();
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      if (authenticated) navigate("/chat", { replace: true });
      else navigate("/login", { replace: true });
    }
  }, [location.pathname]);
  if (data === null || csrf === false) {
    return null;
  }
  return (
    <Box
      className="App"
      minHeight="100vh"
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      backgroundColor="primary.main"
    >
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={closeSnackBar}
        message={snackBarMessage}
        ContentProps={{ style: { fontWeight: "bold" } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackBar}
          severity={severity}
          sx={{ fontWeight: "400" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <ResponsiveAppBar
        data={data}
        pages={getPages()}
        authenticated={authenticated}
        user={user}
      />
      <Box
        minHeight="calc(100vh - 70px)"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Outlet
          context={{
            data,
            onAuthenticate,
            onLogout,
            authToken,
            csrf,
            user,
            showSnackbar,
            authenticated,
            reauthenticate,
          }}
        />
      </Box>
    </Box>
  );
}
