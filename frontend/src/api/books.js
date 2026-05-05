import { http } from "./http";

export function listBooks({ category } = {}) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  return http(`/api/books${qs}`);
}

export function getBook(id) {
  return http(`/api/books/${id}`);
}

export function createBook({ token, book }) {
  return http("/api/books", { method: "POST", token, body: book });
}

export function updateBook({ token, id, patch }) {
  return http(`/api/books/${id}`, { method: "PATCH", token, body: patch });
}

export function deleteBook({ token, id }) {
  return http(`/api/books/${id}`, { method: "DELETE", token });
}

