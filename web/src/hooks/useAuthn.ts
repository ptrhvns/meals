import { AuthnContext, AuthnData } from "../contexts/AuthnContext";
import { useContext } from "react";

export default function useAuthn(): AuthnData {
  return useContext(AuthnContext);
}
