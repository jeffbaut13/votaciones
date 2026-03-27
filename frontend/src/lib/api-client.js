import { env } from "../config/env.js";

async function request(path, options = {}) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error en la solicitud.");
  }

  return json;
}

export const apiClient = {
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  get: (path) => request(path, { method: "GET" }),
};
