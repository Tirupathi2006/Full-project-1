import client from "./client.js";

export function signup({ name, email, password }) {
  return client.post("/auth/signup", { name, email, password }).then((r) => r.data);
}

export function login({ email, password }) {
  return client.post("/auth/login", { email, password }).then((r) => r.data);
}

export function fetchMe() {
  return client.get("/auth/me").then((r) => r.data);
}
