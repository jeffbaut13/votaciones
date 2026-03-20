import express from "express";
import { corsMiddleware } from "../config/cors.js";
import { apiRoutes } from "../routes/index.js";
import { errorHandler } from "../middlewares/error-handler.js";

export function createApp() {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api", apiRoutes);
  app.use(errorHandler);

  return app;
}
