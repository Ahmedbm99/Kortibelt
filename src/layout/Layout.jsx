import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

/** Pages du catalogue : barre de navigation, catégories à gauche (grand écran), pied de page. */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container mx-auto flex flex-1 gap-6 px-4 pt-20">
        <aside className="hidden shrink-0 lg:block">
          <Sidebar />
        </aside>
        <main id="main" className="min-w-0 flex-1 py-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
