import { Toaster } from 'react-hot-toast';
import WhatsAppButton from '@/components/WhatsAppButton';
import AppRoutes from '@/routes';
import { FeedbackProvider } from '@/contexts/FeedbackContext';

export default function App() {
  return (
    <FeedbackProvider>
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { maxWidth: 420 } }} />
      <AppRoutes />
      <WhatsAppButton />
    </FeedbackProvider>
  );
}
