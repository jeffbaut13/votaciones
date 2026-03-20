import twilio from "twilio";
import { env } from "../config/env.js";

let client = null;

export function getTwilioClient() {
  if (!env.twilioAccountSid || !env.twilioAuthToken) {
    return null;
  }

  if (!client) {
    client = twilio(env.twilioAccountSid, env.twilioAuthToken);
  }

  return client;
}
