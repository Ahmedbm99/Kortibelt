// Réglages du site, surchargeables par variables d'environnement Vite (voir .env.example).
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/apiv1",
  recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6Lev8TEsAAAAANCfz2s5Ms7F8YuTCmIwCuxdXY3b",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "21652677764",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "commercial@aisgroup.tn",
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || "+216 74 461 168",
};

export const whatsappLink = (text) =>
  `https://wa.me/${config.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const mailtoLink = (subject, body) =>
  `mailto:${config.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
