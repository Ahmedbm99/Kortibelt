import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ThankYou = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="max-w-lg w-full shadow-xl border-0 animate-fade-in-up">
          <CardContent className="p-10 text-center space-y-6">
            
            <CheckCircle className="w-20 h-20 mx-auto text-green-600" />

            <h1 className="text-3xl font-bold text-primary">
              {t("thankYouTitle")}
            </h1>

            <p className="text-muted-foreground text-lg">
              {t("thankYouMessage")}
            </p>

            <Button
              size="lg"
              className="mt-6 bg-accent hover:bg-orange-600 text-white"
              onClick={() => navigate("/")}
            >
              {t("backToHome")}
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
