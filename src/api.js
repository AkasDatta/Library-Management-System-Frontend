import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ---------- Books ----------
export const getBooks = (search = "") =>
  api.get("/books", { params: search ? { search } : {} }).then((r) => r.data);
export const createBook = (data) => api.post("/books", data).then((r) => r.data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data).then((r) => r.data);
export const deleteBook = (id) => api.delete(`/books/${id}`).then((r) => r.data);

// ---------- Members ----------
export const getMembers = () => api.get("/members").then((r) => r.data);
export const createMember = (data) => api.post("/members", data).then((r) => r.data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data).then((r) => r.data);
export const deleteMember = (id) => api.delete(`/members/${id}`).then((r) => r.data);

// ---------- Borrows ----------
export const getBorrows = (status = "") =>
  api.get("/borrows", { params: status ? { status } : {} }).then((r) => r.data);
export const issueBook = (data) => api.post("/borrows", data).then((r) => r.data);
export const returnBook = (id) => api.put(`/borrows/${id}/return`).then((r) => r.data);

export default api;
