import React from 'react';
import { Factory, Car, Tractor, Bot, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Applications = () => {
  const { t } = useLanguage();

  const applications = [
    {
      key: 'industry',
      icon: Factory,
      link: '/products?application=industry',
    },
    {
      key: 'automobile',
      icon: Car,
      link: '/products?application=automobile',
    },
    {
      key: 'agriculture',
      icon: Tractor,
      link: '/products?application=agriculture',
    },
    {
      key: 'automation',
      icon: Bot,
      link: '/products?application=automation',
    },
    {
      key: 'conveyors',
      icon: Package,
      link: '/products?application=conveyors',
    },
  ];

  return (
    <section id="applications" className="py-20  from-secondary to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('titleapplications')}</h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-5 gap-6">
          {applications.map((app, index) => {
            const Icon = app.icon;
            return (
              <Link to={app.link} key={index} className="group">
                <Card
                  className="
                    border-0 shadow-md transform transition-transform duration-300
                    hover:-translate-y-2 hover:shadow-xl
                    animate-fade-in-up
                  "
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6 text-center">
                    {/* Icon */}
                    <div className="
                      w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full 
                      flex items-center justify-center transition-all duration-300
                      group-hover:scale-110 group-hover:bg-accent/20
                    ">
                      <Icon className="text-accent " size={32} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 text-primary">{t(`title${app.key}`)}</h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">{t(`description${app.key}`)}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Applications;
