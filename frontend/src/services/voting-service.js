import { apiClient } from "../lib/api-client.js";

export const votingService = {
  submitVote: (data) => apiClient.post("/api/votes", data),
};
