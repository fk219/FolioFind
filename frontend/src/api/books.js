import { http } from "./http";

export async function listBooks({ category, page = 1, limit = 12 } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  params.set("page", String(page));
  params.set("limit", String(limit));
  const res = await http(`/api/books?${params}`);
  return { books: res.books, pagination: res.pagination };
}

export async function getBook(id) {
  const res = await http(`/api/books/${id}`);
  return res.book;
}

export function createBook({ token, book }) {
  return http("/api/books", { method: "POST", token, body: book });
}

export function updateBook({ token, id, patch }) {
  return http(`/api/books/${id}`, { method: "PATCH", token, body: patch });
}

export async function listMyBooks({ token }) {
  const res = await http("/api/books/mine", { token });
  return res.books;
}

export function updateBookStatus({ token, id, status }) {
  return http(`/api/books/${id}/status`, { method: "PATCH", token, body: { status } });
}

export function deleteBook({ token, id }) {
  return http(`/api/books/${id}`, { method: "DELETE", token });
}