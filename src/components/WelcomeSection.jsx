import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

const WelcomeSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
            {t("welcome_title")}
          </h1>
          <p className="text-xl text-gray-600 mt-3">
            {t("welcome_subtitle")}
          </p>
        </div>

        {/* Card */}
        <Card className="max-w-5xl mx-auto shadow-lg border border-gray-200 rounded-xl">
          <CardContent className="px-10 py-10 text-lg leading-relaxed text-gray-700">

            {/* Paragraph 1 */}
            <p className="mb-6">
              {t("paragraph1")}
            </p>

            {/* Paragraph 2 */}
            <p className="mb-6">
              {t("experience")}{" "}
              <span className="font-semibold  text-cyan-700 hover:text-orange-400">
                {t("qualitySup")}
              </span>
              ,{" "}
              <span className="font-semibold text-cyan-700 hover:text-orange-400">
                {t("Durabilite")}
              </span>{" "}
              {t("and")}
              <span className="font-semibold text-cyan-700 hover:text-orange-400">
                {t("prix")}
              </span>.
            </p>

            {/* Paragraph 3 */}
         <p className="mb-8">
  <span className="text-cyan-700 hover:text-orange-400 font-semibold">
    {t("kortibelt")}
  </span>{" "}
  {t("paragraph3")}
</p>


            {/* Divider */}
            <Separator className="my-8" />

            {/* Highlight Mission */}
            <p className="text-lg">
              <span className="font-semibold text-orange-500 hover:text-cyan-700">
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
