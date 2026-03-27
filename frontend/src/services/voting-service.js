import { apiClient } from "@/lib/api-client";

export const votingService = {
  submitVote: (payload) => apiClient.post("/votes", payload),
  getSummary: () => apiClient.get("/votes/summary"),
  getRecords: () => apiClient.get("/votes/records"),
};
