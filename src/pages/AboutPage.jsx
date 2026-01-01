import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { materialsTable, applicationsList } from "@/data/families.js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Usine from "@/assets/usine.jpg";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar/>
      <Hero/>
      <section className="pt-32 pb-20 from-white to-slate-50">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="space-y-6 text-center">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              {t("about")}
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed">
              {t("brandDescription1")}
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              {t("brandDescription2")}
            </p>

            <p className="text-lg font-medium text-slate-700">
              {t("distributorIntro")}
            </p>

            <div className="flex justify-center gap-3 flex-wrap pt-4">
              <Badge className="px-4 py-2 text-md">{t("valuePerformance")}</Badge>
              <Badge className="px-4 py-2 text-md">{t("valuePrecision")}</Badge>
              <Badge className="px-4 py-2 text-md">{t("valueReliability")}</Badge>
              <Badge className="px-4 py-2 text-md">{t("valueDurability")}</Badge>
            </div>

            <p className="text-lg text-slate-600">{t("distributorCall")}</p>
          </div>

          {/* Google Map */}
          <div className="mt-10 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d819.8071861254737!2d10.73829756625433!3d34.72462812805315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002d0056200c07%3A0xb6fb8be2de6302ab!2sAIS!5e0!3m2!1sfr!2stn!4v1762950057246!5m2!1sfr!2stn"
              className="w-full h-[350px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AIS Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            {t("materialsTechnology")}
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Table */}

<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: true }}
>
  <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-[1.01]">
    <CardHeader>
      <CardTitle className="text-xl">{t("materialsTechnology")}</CardTitle>
    </CardHeader>

    <CardContent>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">{t("element")}</th>
            <th className="py-2">{t("matter")}</th>
            <th className="py-2">{t("function")}</th>
          </tr>
        </thead>

        <tbody>
          {materialsTable.map((row) => (
            <motion.tr
              key={row.element}
              className="border-b hover:bg-slate-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <td className="py-2 font-medium">{row.element}</td>
              <td className="py-2">{row.matter}</td>
              <td className="py-2">{row.function}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
</motion.div>


            {/* Image */}
            <div className="space-y-4 text-center">
              <img
                src={Usine}
                alt={t("crossSection")}
                className="rounded-xl shadow-lg"
              />
              <p className="text-slate-600">{t("crossSection")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 bg-slate-50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            {t("applications")}
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {applicationsList.map((app) => (
              <Card
                key={app.title}
                className="p-6 rounded-2xl shadow-md hover:shadow-lg transition hover:scale-[1.02]"
              >
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                    <i className={`fas ${app.icon}`}></i>
                    {app.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-slate-600">
                  {app.desc}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
}
