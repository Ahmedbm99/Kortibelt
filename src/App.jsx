import { Flex, Text, Button } from "@radix-ui/themes";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "./components/WhatsAppButton";
import AppRoutes from './routes';
import { useEffect, useState } from "react";
import FeedbackModal from "./pages/FeedbackModal";

export default function MyApp() {
    const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => {
    
    const timer = setTimeout(() => {
      setShowFeedback(true);
      console.log(showFeedback)
    }, 5 * 60 * 1000); 

    return () => clearTimeout(timer);
  }, []);
	return (<>
    <Toaster position="top-right" reverseOrder={false} />
              <AppRoutes />
    <WhatsAppButton/>
    <FeedbackModal visible={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
	);
}
