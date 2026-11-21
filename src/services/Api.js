import axios from "axios";
import { config } from "@/lib/config";

const Api = axios.create({
  baseURL: config.apiUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

/**
 * Traduit une erreur d'appel API en clé de traduction affichable.
 * Codes renvoyés par le backend : captcha_failed, spam_detected, invalid_input, email_failed.
 */
export const apiErrorKey = (error) => {
  if (!error?.response) return "errorNetwork";
  const code = error.response.data?.error;
  if (code === "captcha_failed" || code === "spam_detected") return "errorCaptcha";
  if (code === "email_failed") return "errorEmailFailed";
  if (code === "invalid_input") return "errorForm";
  return "errorGeneric";
};

export default Api;
