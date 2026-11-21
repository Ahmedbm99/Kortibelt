import { cloneElement, useId } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/** Champ de formulaire avec libellé, mention obligatoire/facultatif et message d'erreur relié. */
export default function FormField({ label, required = false, error, children, hint }) {
  const { t } = useLanguage();
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-primary">
        {label}{' '}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground">({t('optional')})</span>
        )}
      </label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
        'aria-required': required || undefined,
      })}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  'h-10 w-full rounded-md border border-input bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-destructive';

export const textareaClass =
  'w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-destructive';
