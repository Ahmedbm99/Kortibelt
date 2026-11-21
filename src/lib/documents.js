// Contenu des PDF envoyés par WhatsApp : devis, message de contact, avis.
// Chaque fonction retourne { file, message } : le PDF et le texte prérempli du message WhatsApp.
import { buildPdf, makeReference } from '@/lib/pdf';

const dateLabel = (language) =>
  new Date().toLocaleString(language === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeStyle: 'short' });

/** Demande de devis : coordonnées, tableau des produits, message. */
export async function buildQuotePdf({ items, form, t, language }) {
  const reference = makeReference('DV');
  const file = await buildPdf({
    title: t('pdfQuoteTitle'),
    reference,
    dateLabel: dateLabel(language),
    fields: [
      [t('nameLabel'), form.name],
      [t('companyLabel'), form.company],
      [t('phoneLabel'), form.phone],
      [t('emailLabel'), form.email],
    ],
    table: {
      title: t('pdfProducts'),
      head: ['#', t('pdfProduct'), t('pdfRef'), t('material'), t('pdfQty'), t('note')],
      body: items.map((i, n) => [n + 1, i.nom, i.reference || i.profil || '', i.material || '', i.quantity, i.note || '']),
      columnStyles: { 0: { cellWidth: 8 }, 4: { cellWidth: 14, halign: 'center' } },
    },
    blocks: [{ title: t('messageLabel'), text: form.message }],
    filename: `kortibelt-devis-${reference}`,
  });
  return { file, reference, message: t('waQuoteMessage', { ref: reference }) };
}

/** Message de contact. */
export async function buildContactPdf({ form, t, language }) {
  const reference = makeReference('MSG');
  const file = await buildPdf({
    title: t('pdfContactTitle'),
    reference,
    dateLabel: dateLabel(language),
    fields: [
      [t('nameLabel'), form.name],
      [t('phoneLabel'), form.phone],
      [t('emailLabel'), form.email],
      [t('subjectLabel'), form.subject],
    ],
    blocks: [{ title: t('messageLabel'), text: form.message }],
    filename: `kortibelt-message-${reference}`,
  });
  return { file, reference, message: t('waContactMessage', { ref: reference }) };
}

/** Avis client : trois notes et commentaire. */
export async function buildFeedbackPdf({ ratings, comment, t, language }) {
  const reference = makeReference('AVIS');
  const file = await buildPdf({
    title: t('pdfFeedbackTitle'),
    reference,
    dateLabel: dateLabel(language),
    table: {
      head: ['Question', t('pdfRating')],
      body: [t('q1'), t('q2'), t('q3')].map((q, i) => [q, `${ratings[i]} / 5`]),
      columnStyles: { 1: { cellWidth: 25, halign: 'center' } },
    },
    blocks: [{ title: t('commentLabel'), text: comment }],
    filename: `kortibelt-avis-${reference}`,
  });
  return { file, reference, message: t('waFeedbackMessage', { ref: reference }) };
}
