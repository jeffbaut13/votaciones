import { voteService } from "../services/vote-service.js";

export const voteController = {
  async submitVote(request, response, next) {
    try {
      const { userId, candidato } = request.body;

      if (!userId || !candidato) {
        return response.status(400).json({ message: "userId y candidato son requeridos." });
      }

      const data = await voteService.submitVote({ userId, candidato });
      response.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  },

  async markPresencial(request, response, next) {
    try {
      const { userId } = request.body;

      if (!userId) {
        return response.status(400).json({ message: "userId es requerido." });
      }

      const data = await voteService.markPresencial({ userId });
      response.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  },

  async getSummary(_request, response, next) {
    try {
      const data = await voteService.getSummary();
      response.json({ data });
    } catch (error) {
      next(error);
    }
  },
};
