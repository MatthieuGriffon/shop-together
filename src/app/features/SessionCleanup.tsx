"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./userSlice";

const SessionCleanup = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUnload = () => {
      console.log("beforeunload triggered"); // Log de débogage
      document.cookie =
        "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("cookie after remove:", document.cookie); // Log de débogage
      dispatch(logout());
      console.log("logout action dispatched"); // Log après le dispatch

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      console.log(
        "localStorage token after remove:",
        localStorage.getItem("token")
      );
      console.log(
        "sessionStorage token after remove:",
        sessionStorage.getItem("token")
      );
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [dispatch]);

  return null;
};

export default SessionCleanup;
