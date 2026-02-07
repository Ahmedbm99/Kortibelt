import Api from "./Api";

const CaptchaServices = {
  sendOTP(data) {
    return Api().post("/auth/send-otp", data);
  },

  verifyContact(data) {
    return Api().post("/auth/verify-contact", data);
  },

addDevis(data) {
    return Api().post("/send-quote", data);
  },
};
export default CaptchaServices;
