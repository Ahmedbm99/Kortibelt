// Génération de PDF dans le navigateur (devis, message, avis) pour l'envoi par WhatsApp.
// jsPDF est chargé à la demande : il n'alourdit pas les pages tant que personne ne choisit WhatsApp.
import logoUrl from '@/assets/logo.png';
import { config } from '@/lib/config';

const NAVY = [10, 26, 47];
const ORANGE = [249, 116, 33];
const GREY = [75, 85, 99];
const MARGIN = 15;

/** Précharge la bibliothèque (à appeler dès que l'utilisateur choisit WhatsApp). */
export const preloadPdf = () => Promise.all([import('jspdf'), import('jspdf-autotable')]);

/** Les polices standard des PDF ne couvrent que le latin (Windows-1252) : on remplace le reste. */
const clean = (value) =>
  String(value ?? '')
    .replace(/[“”«»]/g, '"')
    .replace(/→/g, '->')
    .replace(/[^\n\r\t -ÿ–—‘’…€Œœ]/g, '');

const pad = (n) => String(n).padStart(2, '0');

/** Référence lisible et unique pour le client et l'équipe commerciale, ex. DV-20261121-1432-7K. */
export const makeReference = (prefix) => {
  const d = new Date();
  const rand = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}-${rand}`;
};

const loadImage = async (url) => {
  try {
    const blob = await (await fetch(url)).blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null; // pas de logo : le PDF reste valide
  }
};

/**
 * Construit un PDF.
 * @param {object} doc
 * @param {string} doc.title        ex. "Demande de devis"
 * @param {string} doc.reference    ex. "DV-20261121-1432-7K"
 * @param {string} doc.dateLabel    date formatée dans la langue du site
 * @param {Array<[string,string]>} [doc.fields]  coordonnées (libellé, valeur) ; les valeurs vides sont ignorées
 * @param {{head:string[], body:Array<Array<string|number>>, title?:string}} [doc.table]
 * @param {Array<{title:string, text:string}>} [doc.blocks]  paragraphes (message, commentaire)
 * @param {string} doc.filename     nom du fichier, sans extension
 * @param {string} doc.footer       ligne de pied de page
 * @returns {Promise<File>}
 */
export async function buildPdf({ title, reference, dateLabel, fields = [], table, blocks = [], filename, footer }) {
  const [{ jsPDF }, { autoTable }] = await preloadPdf();
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  // En-tête : bandeau bleu nuit, logo, titre, référence
  pdf.setFillColor(...NAVY);
  pdf.rect(0, 0, width, 32, 'F');
  pdf.setFillColor(...ORANGE);
  pdf.rect(0, 32, width, 1.5, 'F');
  const logo = await loadImage(logoUrl);
  if (logo) {
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(MARGIN, 6, 42, 20, 2, 2, 'F');
    pdf.addImage(logo, 'PNG', MARGIN + 2, 8, 38, 16, undefined, 'FAST');
  } else {
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('KORTIBELT', MARGIN, 20);
  }
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text(clean(title), width - MARGIN, 15, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(clean(`${reference}  ·  ${dateLabel}`), width - MARGIN, 23, { align: 'right' });

  let y = 44;

  // Coordonnées
  const rows = fields.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '');
  if (rows.length) {
    autoTable(pdf, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: 'plain',
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 1.8, textColor: NAVY },
      columnStyles: { 0: { cellWidth: 45, textColor: GREY }, 1: { fontStyle: 'bold' } },
      body: rows.map(([label, value]) => [clean(label), clean(value)]),
    });
    y = pdf.lastAutoTable.finalY + 8;
  }

  // Tableau (produits, notes…)
  if (table?.body?.length) {
    if (table.title) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(...NAVY);
      pdf.text(clean(table.title), MARGIN, y);
      y += 3;
    }
    autoTable(pdf, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [table.head.map(clean)],
      body: table.body.map((r) => r.map(clean)),
      theme: 'striped',
      styles: { font: 'helvetica', fontSize: 9.5, cellPadding: 2.5, textColor: NAVY, valign: 'top' },
      headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [243, 245, 249] },
      columnStyles: table.columnStyles,
    });
    y = pdf.lastAutoTable.finalY + 8;
  }

  // Paragraphes
  for (const block of blocks) {
    if (!block.text || !String(block.text).trim()) continue;
    const lines = pdf.splitTextToSize(clean(block.text), width - MARGIN * 2);
    if (y + 10 + lines.length * 5 > height - 20) {
      pdf.addPage();
      y = 20;
    }
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(...NAVY);
    pdf.text(clean(block.title), MARGIN, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...GREY);
    pdf.text(lines, MARGIN, y + 6);
    y += 12 + lines.length * 5;
  }

  // Pied de page sur chaque page
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(...ORANGE);
    pdf.line(MARGIN, height - 14, width - MARGIN, height - 14);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...GREY);
    pdf.text(clean(footer || `KORTIBELT · ${config.contactPhone} · ${config.contactEmail}`), MARGIN, height - 9);
    pdf.text(`${i} / ${pages}`, width - MARGIN, height - 9, { align: 'right' });
  }

  const blob = pdf.output('blob');
  return new File([blob], `${filename}.pdf`, { type: 'application/pdf' });
}
