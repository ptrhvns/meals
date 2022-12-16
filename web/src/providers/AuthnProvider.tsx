import React, { useState } from "react";
import { AuthnContext, AuthnData } from "../contexts/AuthnContext";

interface AuthnProviderProps {
  children: React.ReactNode;
}

function AuthnProvider({ children }: AuthnProviderProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(
    !!localStorage.getItem("authenticated")
  );

  const value: AuthnData = {
    authenticated,

    login(callback?: () => void): void {
      localStorage.setItem("authenticated", "true");
      setAuthenticated(true);
      if (callback) callback();
    },

    logout(callback?: () => void): void {
      localStorage.removeItem("authenticated");
      setAuthenticated(false);
      if (callback) callback();
    },
  };

  return (
    <AuthnContext.Provider value={value}>{children}</AuthnContext.Provider>
  );
}

export default AuthnProvider;
