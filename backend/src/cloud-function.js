import { onRequest } from "firebase-functions/v2/https";
import { createApp } from "./app/create-app.js";

const app = createApp();

// El backend completo se expone como una Cloud Function HTTP
export const api = onRequest(
  {
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    // Permite que Firebase Hosting reenvie /api/* a esta funcion
    invoker: "public",
  },
  app
);
