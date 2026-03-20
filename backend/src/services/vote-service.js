import crypto from "node:crypto";
import { voteRepository } from "../modules/vote/vote-repository.js";

export const voteService = {
  submitVote({ phone, option }) {
    if (!["A", "B"].includes(option)) {
      throw new Error("Opcion de voto invalida.");
    }

    const existingVote = voteRepository.findVoteByPhone(phone);
    if (existingVote) {
      throw new Error("El usuario ya registro un voto.");
    }

    voteRepository.saveVote({
      id: crypto.randomUUID(),
      phone,
      option,
      createdAt: new Date().toISOString(),
    });

    return {
      summary: voteRepository.getSummary(),
    };
  },
  getSummary() {
    return {
      summary: voteRepository.getSummary(),
    };
  },
  getRecords() {
    return {
      records: voteRepository.getRecords(),
    };
  },
};
