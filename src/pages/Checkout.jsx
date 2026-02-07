import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import toast from 'react-hot-toast';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import CaptchaServices from '@/services/CaptchaServices';

const Checkout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { executeRecaptcha } = useGoogleReCaptcha();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [company, setCompany] = useState('');
const [message, setMessage] = useState('');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/products');
    return null;
  }

  /* ================= SEND WHATSAPP OTP ================= */
  const sendOtp = async () => {
    if (!isValidPhoneNumber(phone)) {
      toast.error(t('invalidPhone'));
      return;
    }

    if (!executeRecaptcha) {
      toast.error('reCAPTCHA not ready');
      return;
    }

    setLoading(true);
    try {
      const captchaToken = await executeRecaptcha('whatsapp_otp');
      await CaptchaServices.sendOTP({ phone, captchaToken });

      setOtpSent(true);
      toast.success(t('otpSent'));
    } catch (err) {
      toast.error(t('errorServer'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT QUOTE ================= */
  const submitQuote = async (e) => {
    e.preventDefault();

    if (!otpSent || otp.length !== 6) {
      toast.error(t('otpRequired'));
      return;
    }

    if (!executeRecaptcha) {
      toast.error('reCAPTCHA not ready');
      return;
    }

    setLoading(true);
    try {
      const captchaToken = await executeRecaptcha('contact_submit');

      await CaptchaServices.verifyContact({
        phone,
        otp,
        captchaToken,
        products: items.map(i => ({
          id: i.id,
          name: i.nom,
          quantity: i.quantity
        }))
      });
 const response = await CaptchaServices.addDevis({
      name,
      email,
      company,
      phone,
      message,
      products: items.map(i => ({
        id: i.id,
        name: i.nom,
        quantity: i.quantity
      })),
    });
    console.log("Devis response:", response);
      if (response.status === 200) {

      toast.success(t('quoteSent'));
      clearCart();
        setTimeout(() => {
    navigate('/thank-you');
  }, 500); 
      }else
      {        toast.error(t('errorServer'));
        return;
      }


    } catch (err) {
      toast.error(t('errorServer'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container max-w-4xl mx-auto px-4">

          <h1 className="text-4xl font-bold text-center mb-12 text-primary">
            {t('checkoutTitle')}
          </h1>

          {/* ================= PRODUCTS ================= */}
          <Card className="mb-10">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">
                {t('selectedProducts')}
              </h2>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <span>{item.nom}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ================= FORM ================= */}
          <form onSubmit={submitQuote}>
            <Card>
              <CardContent className="p-6 space-y-6">

            <Input
              placeholder={t('yourName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />              
          <Input
            type="email"
            placeholder={t('yourEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder={t('company')}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
                {/* PHONE */}
                <PhoneInput
                  international
                  defaultCountry="TN"
                  value={phone}
                  onChange={setPhone}
                  className="border rounded-xl px-3 py-2"
                />

                {/* SEND OTP */}
                <Button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {t('verifyWhatsapp')}
                </Button>

                {/* OTP */}
                {otpSent && (
                  <Input
                    placeholder={t('enterOtp')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                )}

                      <Textarea
            placeholder={t('additionalMessage')}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white text-lg"
                >
                  {t('submitQuote')}
                </Button>

              </CardContent>
            </Card>
          </form>

        </div>
      </section>

      <Footer />
    </>
  );
};

export default Checkout;
