import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingBag } from 'lucide-react';

import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Cart = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity } = useCart();

  const handleRequestQuote = () => {
    const productList = items.map((item) => `${item.name} (x${item.quantity})`).join(', ');
    navigate(`/contact?products=${encodeURIComponent(productList)}`);
  };

  return (
    <div className="min-h-screen bg-background">
        <Navbar/>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              {t('titleCart')}
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto bg-orange-600" />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 animate-fade-in-up ">
              <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h2 className="text-2xl font-bold mb-4 text-primary">{t('empty')}</h2>
              <Button
                size="lg"
                className=" hover:bg-accent/90 bg-orange-600  text-white cursor-pointer"
                onClick={() => navigate('/products')}
              >
                {t('continueShopping')}
              </Button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 mb-8">
                {items.map((item, index) => (
                  <Card
                    key={item.id}
                    className="border-0 shadow-lg animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <img
                          src={
                            item.Images?.length
                              ? `https://ahmedbm99.github.io/Kortibelt${item.Images[0].image_url}`
                              : "/fallback-image.png"
                          }
                          alt={item.nom}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-primary">{item.nom}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={"hover:bg-orange-400 cursor-pointer"}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className={"hover:bg-orange-400 cursor-pointer"}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 size={20} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="lg"
                  className={"text-orange-600 hover:bg-orange-600 hover:text-white cursor-pointer"}
                  onClick={() => navigate('/products')}
                >
                  {t('continueShopping')}
                </Button>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-orange-600 cursor-pointer"
                  onClick={handleRequestQuote}
                >
                  {t('requestQuote')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
          <Footer/>
    </div>
  );
};

export default Cart;
