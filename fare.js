import client from "./client.js";

export function getFareQuote(payload) {
  return client.post("/fare/quote", payload).then((r) => r.data.options);
}
