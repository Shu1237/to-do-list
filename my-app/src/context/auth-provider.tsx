"use client"

import { tokenSession, userSession } from "@/lib/session";
import { AuthProviderProps } from "@/lib/type";
import { useEffect, createContext, useContext } from "react";
import React from "react";

const AuthContext = createContext({
  logout: () => { },
});
export const useAppContext = () => useContext(AuthContext);

export const AuthProvider = ({ children, initialToken }: AuthProviderProps) => {

  useEffect(() => {
    console.log("Initial token:", initialToken);
    if (initialToken) {
      console.log(1)
      tokenSession.value = initialToken;
      console.log(1)
      userSession.setFromToken(initialToken);
      console.log(1)
    }
  }, [initialToken]);


  const logout = () => {
    tokenSession.value = "";
    userSession.clear();
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
};
