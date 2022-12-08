import useAuthn from "../hooks/useAuthn";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface RequireGuestProps {
  children: ReactNode;
}

export default function RequireGuest({ children }: RequireGuestProps) {
  const authn = useAuthn();

  if (authn.authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
