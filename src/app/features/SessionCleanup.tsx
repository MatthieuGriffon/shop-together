"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./userSlice";

const SessionCleanup = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUnload = () => {
      document.cookie =
        "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(logout());
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [dispatch]);

  return null;
};

export default SessionCleanup;
