import { isValidPhoneNumber } from 'react-phone-number-input';

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

/**
 * Valide un objet de champs selon des règles simples.
 * rules : { champ: { required?, email?, phone? } } → { champ: 'cléDeTraduction' }
 */
export function validateFields(values, rules) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const value = String(values[field] ?? '').trim();
    if (rule.required && !value) errors[field] = 'errorRequired';
    else if (rule.email && value && !isEmail(value)) errors[field] = 'errorEmail';
    else if (rule.phone && value && !isValidPhoneNumber(value)) errors[field] = 'invalidPhone';
  }
  return errors;
}
