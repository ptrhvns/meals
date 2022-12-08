import useAuthn from "../hooks/useAuthn";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface RequireAuthnProps {
  children: ReactNode;
}

export default function RequireAuthn({ children }: RequireAuthnProps) {
  const authn = useAuthn();
  const location = useLocation();

  if (!authn.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
