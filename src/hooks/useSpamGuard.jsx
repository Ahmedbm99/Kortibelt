import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

/**
 * Protection anti-spam des formulaires, vérifiée côté serveur :
 * - champ piège `website` (caché, laissé vide par un humain)
 * - horodatage `startedAt` (un robot soumet en moins de 3 s)
 * - jeton reCAPTCHA v3 obtenu au moment de l'envoi
 *
 * Usage : const guard = useSpamGuard(); … await guard.fields("quote_submit")
 */
export function useSpamGuard() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [startedAt] = useState(() => Date.now());
  const [honeypot, setHoneypot] = useState("");

  /** Champs à ajouter au corps de la requête. Lève "captcha_unavailable" si reCAPTCHA est bloqué. */
  const fields = async (action) => {
    if (!executeRecaptcha) throw new Error("captcha_unavailable");
    const captchaToken = await executeRecaptcha(action);
    return { captchaToken, startedAt, website: honeypot };
  };

  /** Champ piège à placer dans le formulaire. */
  const honeypotInput = (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </label>
    </div>
  );

  return { fields, honeypotInput, ready: Boolean(executeRecaptcha) };
}
