import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/** Pages hors catalogue : barre de navigation fixe, contenu, pied de page. */
export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main id="main" className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
