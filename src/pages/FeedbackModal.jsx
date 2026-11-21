import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Feedback from '@/components/Feedback';
import RecaptchaProvider from '@/components/RecaptchaProvider';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeedbackModal({ visible, onClose }) {
  const { t } = useLanguage();
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-md grid-cols-1 overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>{t('feedbackTitle')}</DialogTitle>
          <DialogDescription className="sr-only">{t('feedbackTitle')}</DialogDescription>
        </DialogHeader>
        {visible && (
          <RecaptchaProvider>
            <Feedback onDone={onClose} />
          </RecaptchaProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
