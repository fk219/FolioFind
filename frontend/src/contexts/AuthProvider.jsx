import { createContext, useCallback, useEffect, useState } from "react";
import * as authApi from "../api/auth";

export const AuthContext = createContext();

const TOKEN_KEY = "bookstore_token";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async (nextToken) => {
    if (!nextToken) {
      setUser(null);
      return;
    }
    const res = await authApi.me({ token: nextToken });
    setUser(res.user);
  }, []);

  async function login(email, password) {
    setLoading(true);
    const res = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    await refreshMe(res.token);
    setLoading(false);
    return res;
  }

  async function createUser(email, password, fullName) {
    setLoading(true);
    const res = await authApi.register({ email, password, fullName });
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    await refreshMe(res.token);
    setLoading(false);
    return res;
  }

  function logOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        if (token) {
          await refreshMe(token);
        } else {
          setUser(null);
        }
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, refreshMe]);

  return (
    <AuthContext.Provider value={{ user, loading, token, login, createUser, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
