import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

const WelcomeSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {t("welcome_title")}
          </h2>
          <p className="text-xl text-muted-foreground mt-3">
            {t("welcome_subtitle")}
          </p>
        </div>

        {/* Card */}
        <Card className="max-w-5xl mx-auto shadow-lg border border-gray-200 rounded-xl">
          <CardContent className="px-6 py-8 md:px-10 md:py-10 text-lg leading-relaxed text-primary/90">

            {/* Paragraph 1 */}
            <p className="mb-6">
              {t("paragraph1")}
            </p>

            {/* Paragraph 2 */}
            <p className="mb-6">
              {t("experience")}{" "}
              <span className="font-semibold  text-accent-text">
                {t("qualitySup")}
              </span>
              ,{" "}
              <span className="font-semibold text-accent-text">
                {t("Durabilite")}
              </span>{" "}
              {t("and")}
              <span className="font-semibold text-accent-text">
                {t("prix")}
              </span>.
            </p>

            {/* Paragraph 3 */}
         <p className="mb-8">
  <span className="text-accent-text font-semibold">
    {t("kortibelt")}
  </span>{" "}
  {t("paragraph3")}
</p>


            {/* Divider */}
            <Separator className="my-8" />

            {/* Highlight Mission */}
            <p className="text-lg">
              <span className="font-semibold text-accent-text">
                {t("mission_label")} 
              </span>{" "}
              {t("mission_text")}
            </p>

          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default WelcomeSection;
