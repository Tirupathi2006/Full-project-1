import client from "./client.js";

export function createRide(payload) {
  return client.post("/rides", payload).then((r) => r.data);
}

export function listRides() {
  return client.get("/rides").then((r) => r.data);
}

export function getStats() {
  return client.get("/rides/stats").then((r) => r.data);
}
