import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import FeedbackService from "../services/FeedbackServices";
import toast, { Toaster } from "react-hot-toast";

const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Button
          key={i}
          variant={i <= value ? "default" : "default"}
          size="sm"
          onClick={() => onChange(i)}
        >
          <Star className={i <= value ? "text-yellow-400" : "text-gray-400 hover:bg-orange-300"} />
        </Button>
      ))}
    </div>
  );
};

export default function Feedback() {
  const { language } = useLanguage();

  const questions = {
    q1: language === "en" ? "How would you rate your experience?" : "Comment évaluez-vous votre expérience ?",
    q2: language === "en" ? "Is the platform easy to use?" : "La plateforme est-elle facile à utiliser ?",
    q3: language === "en" ? "Would you recommend this service?" : "Recommanderiez-vous ce service ?",
    avisLabel: language === "en" ? "Your feedback" : "Avis",
    send: language === "en" ? "Submit" : "Envoyer",
    validationError: language === "en" ? "Please fill all ratings and feedback." : "Veuillez remplir toutes les évaluations et le commentaire.",
    success: language === "en" ? "Thank you for your feedback!" : "Merci pour votre feedback !",
    submitError: language === "en" ? "Error submitting feedback." : "Erreur lors de l’envoi.",
  };

  const [form, setForm] = useState({
    reponse1: 0,
    reponse2: 0,
    reponse3: 0,
    avis: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (form.reponse1 === 0 || form.reponse2 === 0 || form.reponse3 === 0 || form.avis.trim() === "") {
      toast.error(questions.validationError);
      return;
    }

    try {
      await FeedbackService.addFeedback(form);
      toast.success(questions.success);
      setForm({ reponse1: 0, reponse2: 0, reponse3: 0, avis: "" });
    } catch (err) {
      console.error(err);
      toast.error(questions.submitError);
    }
  };

  return (
    <section className="space-y-6 p-4 bg-white shadow-md max-w-xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="space-y-3">
        <Label>{questions.q1}</Label>
        <StarRating className="hover:bg-orange-300" value={form.reponse1} onChange={(val) => updateField("reponse1", val)} />
      </div>

      <div className="space-y-3">
        <Label>{questions.q2}</Label>
        <StarRating className="hover:bg-orange-300" value={form.reponse2} onChange={(val) => updateField("reponse2", val)} />
      </div>

      <div className="space-y-3">
        <Label>{questions.q3}</Label>
        <StarRating className="hover:bg-orange-300" value={form.reponse3} onChange={(val) => updateField("reponse3", val)} />
      </div>

      <div className="space-y-2">
        <Label >{questions.avisLabel}</Label>
        <Input
          type="text"
          value={form.avis}
          onChange={(e) => updateField("avis", e.target.value)}
          placeholder={language === "en" ? "Write something..." : "Écrivez quelque chose..."}
        />
      </div>

      <Button onClick={handleSubmit} className={"cursor-pointer border-2 bg-white text-orange-400 hover:bg-orange-400 hover:text-white"}>{questions.send}</Button>
    </section>
  );
}
