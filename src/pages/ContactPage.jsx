import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { MapPin, Phone, Mail, Globe, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <>
    <Navbar/>
    <section id="contact" className="py-24 from-white to-slate-50">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-slate-900 mb-16"
        >
          {t("contactDistribution")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="shadow-md">
              <CardContent className="p-6 space-y-6">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#F97421]" size={28} />
                  <div>
                    <h4 className="font-semibold text-lg">{t("address")}</h4>
                    <p className="text-slate-600 leading-tight">
                      {t("industrialZone")}<br />{t("tunisia")}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone className="text-[#F97421]" size={28} />
                  <div>
                    <h4 className="font-semibold text-lg">{t("phone")}</h4>
                    <p className="text-slate-600">+216 74 461 168</p>
                  </div>
                </div>

                {/* WeChat */}
                <div className="flex items-start gap-4">
                  <MessageSquare className="text-[#F97421]" size={28} />
                  <div>
                    <h4 className="font-semibold text-lg">WeChat</h4>
                    <p className="text-slate-600">medfakhfakh</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="text-[#F97421]" size={28} />
                  <div>
                    <h4 className="font-semibold text-lg">{t("email")}</h4>
                    <p className="text-slate-600">commercial@aisgroup.tn</p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-4">
                  <Globe className="text-[#F97421]" size={28} />
                  <div>
                    <h4 className="font-semibold text-lg">{t("website")}</h4>
                    <p className="text-slate-600">
                      <a
                        href="https://www.aisgroup.tn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F97421] hover:underline"
                      >
                        aisgroup.tn
                      </a>
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={(e) => e.preventDefault()}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-md">
              <CardContent className="p-6 space-y-6">
                
                <Input
                  type="text"
                  placeholder={t("yourName")}
                  required
                  className="h-12"
                />

                <Input
                  type="email"
                  placeholder={t("yourEmail")}
                  required
                  className="h-12"
                />

                <Input
                  type="text"
                  placeholder={t("subject")}
                  required
                  className="h-12"
                />

                <Textarea
                  rows="5"
                  placeholder={t("yourMessage")}
                  required
                  className="resize-none"
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#F97421] hover:bg-[#ff7f2d] cursor-pointer text-white text-lg rounded-xl"
                >
                  {t("sendMessage")}
                </Button>

              </CardContent>
            </Card>
          </motion.form>

        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
}
