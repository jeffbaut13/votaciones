import { env } from "@/config/env";

export function getFirebaseClientConfig() {
  return env.firebase;
}
