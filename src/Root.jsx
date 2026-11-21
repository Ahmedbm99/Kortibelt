import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import App from '@/App.jsx';

/**
 * Arbre commun au navigateur (main.jsx) et au pré-rendu (entry-server.jsx), sous le routeur.
 * reCAPTCHA n'est chargé que sur les pages à formulaire (voir RecaptchaProvider) : script Google
 * de ~350 Ko et cookies tiers évités sur le reste du site.
 */
export default function Root() {
  return (
    <LanguageProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LanguageProvider>
  );
}
