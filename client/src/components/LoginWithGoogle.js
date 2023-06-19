import { GoogleLogin } from "@react-oauth/google";
import { useOutletContext } from "react-router-dom";
import { useHistoryNavigate } from "../hooks";

export function LoginWithGoogle(props) {
  const { csrf, onAuthenticate, showSnackbar } = useOutletContext();
  const navigate = useHistoryNavigate();

  const createUser = async (credential) => {
    const res = await fetch("/api/users/createGoogleUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
        Authorization: `Bearer ${credential}`,
      },
    });
    if (res.status === 200) {
      navigate("/chat");
      return true;
    }
    return false;
  };
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const success = await createUser(credentialResponse.credential);
        if (success) onAuthenticate(credentialResponse.credential);
        else showSnackbar("Error creating user", "error");
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      theme="filled_black"
      auto_select
    />
  );
}
