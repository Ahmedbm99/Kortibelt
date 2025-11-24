import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Feedback from "@/components/Feedback";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FeedbackModal({ visible, onClose }) {
  const { t } = useLanguage();
  return (
    <Dialog open={visible} onOpenChange={onClose} className="bg-white">
      <DialogContent className="max-w-md bg-white" >
        <DialogHeader>
          <DialogTitle>{t('feedback')}</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <Feedback />
        </div>

        <DialogFooter>
          <Button variant="outline"  className={"cursor-pointer bg-orange-400 text-white hover:bg-white hover:text-orange-400"} onClick={onClose}>
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
