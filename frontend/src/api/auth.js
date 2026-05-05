import { http } from "./http";

export function register({ email, password }) {
  return http("/api/auth/register", { method: "POST", body: { email, password } });
}

export function login({ email, password }) {
  return http("/api/auth/login", { method: "POST", body: { email, password } });
}

export function me({ token }) {
  return http("/api/auth/me", { token });
}

