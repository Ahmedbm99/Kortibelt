import { createContext, lazy, Suspense, useContext, useState } from 'react';

// Le questionnaire d'avis s'ouvre uniquement à la demande (page merci, lien du pied de page).
// Son code (fenêtre, formulaire, envoi, PDF) n'est téléchargé qu'à la première ouverture.
const FeedbackModal = lazy(() => import('@/pages/FeedbackModal'));
const FeedbackContext = createContext({ openFeedback: () => {} });

export function FeedbackProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const openFeedback = () => {
    setRequested(true);
    setOpen(true);
  };
  return (
    <FeedbackContext.Provider value={{ openFeedback }}>
      {children}
      {requested && (
        <Suspense fallback={null}>
          <FeedbackModal visible={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </FeedbackContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFeedback = () => useContext(FeedbackContext);
