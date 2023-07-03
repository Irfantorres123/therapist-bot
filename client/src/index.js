import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import Services, { serviceLoader } from "./components/pages/Services";
import Chat, { chatLoader } from "./components/pages/Chat";
import Logout from "./components/pages/Logout";
import Login from "./components/pages/Login";
import { blue } from "@mui/material/colors";
import Register from "./components/pages/Register";

import { GoogleOAuthProvider } from "@react-oauth/google";
import AboutUs from "./components/pages/AboutUs";
import Features from "./components/pages/Features";
import Home from "./components/pages/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
const theme = createTheme({
  palette: {
    background: {
      default: "#F9F7F7",
    },
    primary: {
      main: "#DBE2EF",
    },
    secondary: {
      main: "#3F72AF",
    },
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    fontColor: "#112D4E",
  },
});
const themeAlternate = createTheme({
  /*   palette: {
    mode: "light",

    primary: {
      main: "#56AAFF",
    },
    secondary: {
      main: blue[600],
    },
    error: {
      main: "#bb0000",
    },
  }, */
  palette: {
    mode: "dark",
    primary: {
      main: "#1c1c1c",
    },
    secondary: {
      main: "#5e5e5e",
    },
    error: {
      main: "#bb0000",
    },
    background: {
      default: "#1c1c1c",
    },
  },

  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: "bold",
      textAlign: "center",
    },
    h5: {
      fontFamily: "Roboto",
      fontSize: "1rem",
      fontWeight: "500",
    },
    h6: {
      fontSize: "1rem",
      fontFamily: "Glory",
      fontWeight: "400",
    },
    h7: {
      fontFamily: "Glory",
      fontSize: "1rem",
      fontWeight: "400",
    },
    h8: {
      fontFamily: ["Glory"],
      fontSize: "0.8rem",
      fontWeight: "500",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: 'Goldman';
        font-style: normal;
        font-weight: 700;
        src: url('./fonts/goldman-v13-latin-700.eot'); /* IE9 Compat Modes */
        src: local(''),
             url('./fonts/goldman-v13-latin-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
             url('./fonts/goldman-v13-latin-700.woff2') format('woff2'), /* Super Modern Browsers */
             url('./fonts/goldman-v13-latin-700.woff') format('woff'), /* Modern Browsers */
             url('./fonts/goldman-v13-latin-700.ttf') format('truetype'), /* Safari, Android, iOS */
             url('./fonts/goldman-v13-latin-700.svg#Goldman') format('svg'); /* Legacy iOS */
      }
      `,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, //right before change...
    children: [
      {
        path: "services",
        element: <Services />,
        loader: serviceLoader,
      },
      {
        path: "chat",
        element: <Chat />,
        loader: chatLoader,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  {
    path: "/ana",
    element: <Home />,
  }
]);

root.render(
  <ThemeProvider theme={themeAlternate}>
    <GoogleOAuthProvider clientId="757032984246-2gepdgmg813kfphv92334hq7r8i6308o.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
