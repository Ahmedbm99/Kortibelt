import Api from "./Api";

const ContactService = {
  sendMessage(data) {
    return Api().post("/contact/send-message", data);
  },

};
export default ContactService;
