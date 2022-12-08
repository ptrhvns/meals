import React, { useState } from "react";
import useApi from "../hooks/useApi";
import { AuthnContext, AuthnData } from "../contexts/AuthnContext";

interface AuthnProviderProps {
  children: React.ReactNode;
}

function AuthnProvider({ children }: AuthnProviderProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(
    !!localStorage.getItem("authenticated")
  );

  const login = (callback?: () => void): void => {
    localStorage.setItem("authenticated", "true");
    setAuthenticated(true);

    if (callback) {
      callback();
    }
  };

  const logout = (callback?: () => void): void => {
    localStorage.removeItem("authenticated");
    setAuthenticated(false);

    if (callback) {
      callback();
    }
  };

  const value: AuthnData = { authenticated: authenticated, login, logout };

  return (
    <AuthnContext.Provider value={value}>{children}</AuthnContext.Provider>
  );
}

export default AuthnProvider;
