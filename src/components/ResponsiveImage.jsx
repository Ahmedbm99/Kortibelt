import { imageSources, onImageError } from '@/lib/asset';

/**
 * Image du catalogue optimisée : vignettes adaptées à l'écran (srcset/sizes), chargement différé,
 * dimensions réservées (pas de décalage de mise en page) et image par défaut si le fichier manque.
 * priority : image visible dès l'arrivée (chargée tout de suite, en priorité).
 */
export default function ResponsiveImage({ src, alt = '', sizes = '100vw', priority = false, width = 800, height = 600, className = '' }) {
  const sources = imageSources(src);
  return (
    <img
      src={sources.src}
      srcSet={sources.srcSet}
      sizes={sources.srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      onError={onImageError}
      className={className}
    />
  );
}
