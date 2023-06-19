import { useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import { useOutletContext } from "react-router-dom";

export default function Logout() {
  const { reauthenticate } = useOutletContext();
  useEffect(() => {
    googleLogout();
    reauthenticate();
  }, []);
  return null;
}
