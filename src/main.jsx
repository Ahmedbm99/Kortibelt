import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme  } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Provider } from 'react-redux';
import { CartProvider } from "@/contexts/CartContext";
import "react-phone-number-input/style.css";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import App from '@/App.jsx'
import store from '@/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleReCaptchaProvider
  reCaptchaKey="6Lev8TEsAAAAANCfz2s5Ms7F8YuTCmIwCuxdXY3b"
  language="fr"
>
        <Provider store={store}>
<CartProvider>
         <LanguageProvider>

      <BrowserRouter basename="/Kortibelt/">

    <Theme >
    <App />
    </Theme>
  </BrowserRouter>
  </LanguageProvider>
  </CartProvider>
        </Provider>
</GoogleReCaptchaProvider>
  </StrictMode>,
)
