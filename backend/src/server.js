import { env } from "./config/env.js";
import { createApp } from "./app/create-app.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Backend listening on http://localhost:${env.port}`);
});
