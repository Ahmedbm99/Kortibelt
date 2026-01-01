import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import CaptchaServices from "@/services/CaptchaServices";

import { MapPin, Phone, Mail, Globe, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function ContactPage() {
  const { t } = useLanguage();
  const { executeRecaptcha } = useGoogleReCaptcha();
  motion;
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     SEND WHATSAPP OTP
     ========================= */
  const sendWhatsappOtp = async () => {
    if (!isValidPhoneNumber(phone)) {
      toast.error(t("invalidPhone"));
      return;
    }

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA non prêt");
      return;
    }

    setLoading(true);

    try {
      const captchaToken = await executeRecaptcha("whatsapp_otp");

      await CaptchaServices.sendOTP({
        phone,
        captchaToken,
      });

      setOtpSent(true);
      toast.success(t("otpSent"));
    } catch (error) {
      toast.error(t("errorWhatsApp"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FORM SUBMIT
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent || otp.length !== 6) {
      toast.error(t("otpRequired"));
      return;
    }

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA non prêt");
      return;
    }

    setLoading(true);

    try {
      const captchaToken = await executeRecaptcha("contact_submit");

      await CaptchaServices.verifyContact({
        phone,
        otp,
        captchaToken,
      });

      toast.success(t("messageSent"));

      // reset
      setPhone("");
      setOtp("");
      setOtpSent(false);
    } catch (error) {
      toast.error("errorServer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section id="contact" className="py-24">
        <div className="container max-w-6xl mx-auto px-4">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-16"
          >
            {t("contactDistribution")}
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10">

            {/* ================= CONTACT INFO ================= */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6 space-y-6">
                  <Info icon={<MapPin />} title={t("address")} text={`${t("industrialZone")}\n${t("tunisia")}`} />
                  <Info icon={<Phone />} title={t("phone")} text="+216 74 461 168" />
                  <Info icon={<MessageSquare />} title="WeChat" text="medfakhfakh" />
                  <Info icon={<Mail />} title={t("email")} text="commercial@aisgroup.tn" />
                  <Info
                    icon={<Globe />}
                    title={t("website")}
                    text={
                      <a
                        href="https://www.aisgroup.tn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F97421] hover:underline"
                      >
                        aisgroup.tn
                      </a>
                    }
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* ================= FORM ================= */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6 space-y-6">

                  <Input placeholder={t("yourName")} required />
                  <Input type="email" placeholder={t("yourEmail")} required />
                  <Input placeholder={t("subject")} required />

                  {/* PHONE */}
                  <div>
                    <PhoneInput
                      international
                      defaultCountry="TN"
                      value={phone}
                      onChange={setPhone}
                      className="border rounded-xl px-3 py-2"
                    />
                    {phone && !isValidPhoneNumber(phone) && (
                      <p className="text-red-500 text-sm mt-1">
                        {t("invalidPhone")}
                      </p>
                    )}
                  </div>

                  {/* SEND OTP */}
                  <Button
                    type="button"
                    onClick={sendWhatsappOtp}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {t("verifyWhatsapp")}
                  </Button>

                  {/* OTP INPUT */}
                  {otpSent && (
                    <Input
                      placeholder={t("enterOtp")}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  )}

                  <Textarea placeholder={t("yourMessage")} rows={4} />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#F97421] hover:bg-[#ff7f2d] text-white text-lg rounded-xl"
                  >
                    {t("sendMessage")}
                  </Button>

                </CardContent>
              </Card>
            </motion.form>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ================= INFO COMPONENT ================= */
function Info({ icon, title, text }) {
  return (
    <div className="flex gap-4 items-start">
      {React.cloneElement(icon, { className: "text-[#F97421]", size: 28 })}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-slate-600 whitespace-pre-line">{text}</p>
      </div>
    </div>
  );
}
