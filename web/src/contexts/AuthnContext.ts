import { createContext } from "react";

export interface AuthnData {
  authenticated: boolean;
  login: (callback?: () => void) => void;
  logout: (callback?: () => void) => void;
}

export const AuthnContext = createContext<AuthnData>({
  authenticated: false,
  login: () => {
    throw Error("The login() function has not been not implemented yet.");
  },
  logout: () => {
    throw Error("The logout() function has not been implemented yet.");
  },
});
