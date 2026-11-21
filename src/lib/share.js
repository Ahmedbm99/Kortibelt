// Envoi d'un fichier vers WhatsApp depuis le navigateur.
// Un lien wa.me ne peut pas joindre de fichier : on passe par la feuille de partage du système
// (téléphones, Windows/macOS récents) ou, à défaut, par un téléchargement + ouverture de la discussion.

/** true si le navigateur sait partager ce fichier (feuille de partage avec WhatsApp). */
export const canShareFile = (file) => {
  try {
    return Boolean(file && navigator.canShare?.({ files: [file] }));
  } catch {
    return false;
  }
};

/**
 * Ouvre la feuille de partage avec le PDF. Doit être appelé directement depuis un clic.
 * Retourne 'shared', 'cancelled' ou 'unsupported'.
 */
export async function shareFile(file, text) {
  if (!canShareFile(file)) return 'unsupported';
  try {
    await navigator.share({ files: [file], text });
    return 'shared';
  } catch (err) {
    return err?.name === 'AbortError' ? 'cancelled' : 'unsupported';
  }
}

/** Télécharge le fichier sur l'appareil. */
export function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
