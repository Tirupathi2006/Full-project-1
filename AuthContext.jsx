import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("rw_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("rw_token");
    if (!token) {
      setReady(true);
      return;
    }
    authApi
      .fetchMe()
      .then((me) => {
        setUser(me);
        localStorage.setItem("rw_user", JSON.stringify(me));
      })
      .catch(() => {
        localStorage.removeItem("rw_token");
        localStorage.removeItem("rw_user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  function persist({ token, user }) {
    localStorage.setItem("rw_token", token);
    localStorage.setItem("rw_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(credentials) {
    const data = await authApi.login(credentials);
    persist(data);
    return data.user;
  }

  async function signup(details) {
    const data = await authApi.signup(details);
    persist(data);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("rw_token");
    localStorage.removeItem("rw_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
