import { Routes, Route } from 'react-router-dom';
import Layout from '@/layout/Layout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<Layout />}>
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Products />} />

        <Route path="/products/product/:id" element={<ProductDetail />} />

      </Route>
             <Route path="/about" element={<AboutPage/>} />
       <Route path='/contact' element={<ContactPage/>} />
 <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
