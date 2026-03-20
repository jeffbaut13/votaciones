import { voteService } from "../services/vote-service.js";

export const voteController = {
  submitVote(request, response, next) {
    try {
      const data = voteService.submitVote(request.body);
      response.status(201).json({ message: "Voto registrado", data });
    } catch (error) {
      next(error);
    }
  },
  getSummary(_request, response, next) {
    try {
      const data = voteService.getSummary();
      response.json({ data });
    } catch (error) {
      next(error);
    }
  },
  getRecords(_request, response, next) {
    try {
      const data = voteService.getRecords();
      response.json({ data });
    } catch (error) {
      next(error);
    }
  },
};
