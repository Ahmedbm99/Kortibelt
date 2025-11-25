import React from "react";
import classificationData from "@/data/data.js";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function MatiereComponent() {
  const { language } = useLanguage(); // "fr" ou "en"
  const [searchParams] = useSearchParams();
  const id = parseInt(searchParams.keys().next().value, 10);

  const surfaceData = Object.values(classificationData).find(c => c.id === id);
  if (!surfaceData) return <p className="text-center py-10">Aucune donnée disponible.</p>;

  const types = surfaceData.types || [];

  // Variants pour l'animation des sections
  const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const imageVariant = {
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <section className="w-full bg-white mt-9">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {types.map((type, index) => (
          <motion.div
            key={type.id}
            className="mb-16"
            initial="hidden"
            animate="visible"
            variants={sectionVariant}
            transition={{ delay: index * 0.2 }}
          >
            {/* Titre */}
            <header className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                {type.name[language]}
              </h2>
              <div className="mx-auto mt-2 h-1.5 w-20 bg-rose-500 rounded" />
            </header>

            {/* Propriétés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-sm border-0 mb-6">
                <CardContent className="p-6">
                  <ol className="list-decimal list-inside space-y-2 text-slate-700">
                    {type.properties && type.properties.length > 0 ? (
                      type.properties.map((prop, idx) => (
                        <li key={idx}>{prop[language]}</li>
                      ))
                    ) : (
                      <li>Aucune propriété disponible.</li>
                    )}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>

            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {type.images && type.images.length > 0 ? (
                type.images.map((img, idx) => (
                  <motion.figure
                    key={idx}
                    className="rounded-lg overflow-hidden shadow-sm"
                    whileHover="hover"
                    variants={imageVariant}
                  >
                    <img
                      src={img}
                      alt={`${type.name[language]}-${idx}`}
                      className="w-full h-44 object-cover"
                    />
                  </motion.figure>
                ))
              ) : (
                <p>Aucune image disponible.</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
