import { Routes, Route } from 'react-router-dom';
import Layout from '@/layout/Layout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import MatierePage from './pages/MatierePage';
import  Types from '@/pages/Types';
import ScrollToTop from '@/components/ScrollToTop';
import Checkout from '@/pages/Checkout';
import ThankYou from '@/pages/thankyou';
import SubCategory from '@/pages/subCategory';
export default function AppRoutes() {
  return (
    <>
    <ScrollToTop />
    <Routes>

      <Route path="/" element={<Home />} />

      <Route element={<Layout />}>
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Products />} />
        <Route path="/category/:familyid" element={<Types />} />
        <Route path="/subcategory/:subcategoryid" element={<SubCategory />} />
        <Route path="/products/product/:id" element={<ProductDetail />} />

      </Route>
            <Route path ="/checkout" element ={<Checkout />} />
             <Route path="/classement" element={<MatierePage/>} />  
             <Route path="thank-you" element={<ThankYou />} />
             <Route path="/about" element={<AboutPage/>} />
       <Route path='/contact' element={<ContactPage/>} />
 <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
</>
  );
}
