import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter/wght.css';
import 'react-phone-number-input/style.css';
import '@/index.css';

import Root from '@/Root';

const app = (
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>
);

// Pages pré-rendues (HTML déjà présent) : React reprend la main sans tout redessiner.
// Pages client uniquement (devis, merci…) : rendu classique.
const container = document.getElementById('root');
// React gère lui-même <title>, <meta> et <link> : on retire ceux du pré-rendu pour éviter les doublons.
document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
if (container.firstElementChild && !('clientOnly' in container.dataset)) hydrateRoot(container, app);
else {
  container.textContent = '';
  createRoot(container).render(app);
}
