import { http } from "./http";

export function getShelf({ token }) {
  return http("/api/shelf", { token });
}

export function saveShelfItem({ token, bookId, status, note }) {
  return http(`/api/shelf/${bookId}`, { method: "PUT", token, body: { status, note } });
}

export function removeShelfItem({ token, bookId }) {
  return http(`/api/shelf/${bookId}`, { method: "DELETE", token });
}
