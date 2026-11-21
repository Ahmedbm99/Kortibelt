import Api from "./Api";

const ContactService = {
  /** Envoie le formulaire de contact. */
  sendMessage(data) {
    return Api.post("/contact/send-message", data);
  },
  /** Envoie une demande de devis (panier). */
  sendQuote(data) {
    return Api.post("/send-quote", data);
  },
};

export default ContactService;
