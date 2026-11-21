import { useLanguage } from '@/contexts/LanguageContext';
import { materialsTable } from '@/data/families.js';
import Usine from '@/assets/usine.webp';
import PageHeader from '@/components/PageHeader';
import SectionTitle from '@/components/SectionTitle';
import Applications from '@/components/ApplicationComponent';
import Seo from '@/components/Seo';

const VALUES = ['valuePerformance', 'valuePrecision', 'valueReliability', 'valueDurability'];

export default function AboutPage() {
  const { t, language } = useLanguage();
  const pick = (v) => v[language] || v.fr;

  return (
    <>
      <Seo title={t('seoAboutTitle')} description={t('overviewKortibelt')} />
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <PageHeader title={t('aboutKortibelt')} />
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>{t('brandDescription1')}</p>
          <p>{t('brandDescription2')}</p>
          <p className="font-medium text-primary">{t('distributorIntro')}</p>
          <ul className="flex flex-wrap gap-3">
            {VALUES.map((k) => (
              <li key={k} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                {t(k)}
              </li>
            ))}
          </ul>
          <p>{t('distributorCall')}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d819.8071861254737!2d10.73829756625433!3d34.72462812805315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002d0056200c07%3A0xb6fb8be2de6302ab!2sAIS!5e0!3m2!1sfr!2stn!4v1762950057246!5m2!1sfr!2stn"
            className="h-[350px] w-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AIS Group — Google Maps"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionTitle>{t('materialsTechnology')}</SectionTitle>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="w-full text-left text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3">{t('elementCol')}</th>
                    <th scope="col" className="px-4 py-3">{t('materialCol')}</th>
                    <th scope="col" className="px-4 py-3">{t('functionCol')}</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsTable.map((row, i) => (
                    <tr key={row.element.fr} className={i % 2 ? 'bg-secondary/60' : 'bg-white'}>
                      <th scope="row" className="px-4 py-3 font-semibold text-primary">{pick(row.element)}</th>
                      <td className="px-4 py-3">{pick(row.matter)}</td>
                      <td className="px-4 py-3">{pick(row.function)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <figure className="text-center">
              <img src={Usine} alt={t('crossSection')} loading="lazy" className="rounded-xl shadow-lg" />
              <figcaption className="mt-3 text-muted-foreground">{t('crossSection')}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <Applications />
    </>
  );
}
