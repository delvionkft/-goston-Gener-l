import { contact, isPlaceholder } from '../config/site';

/**
 * A telefonszám `tel:` hivatkozássá alakítása.
 * `undefined`, ha a szám még kitöltetlen helyőrző — ilyenkor a felület
 * szöveget mutat link helyett, hogy ne legyen működésképtelen gomb.
 */
export function telHref(): string | undefined {
  const raw = isPlaceholder(contact.phoneHref) ? contact.phoneDisplay : contact.phoneHref;
  if (isPlaceholder(raw) || !raw.trim()) return undefined;
  const cleaned = raw.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : undefined;
}

/** Ugyanez az e-mail-címre. */
export function mailHref(): string | undefined {
  if (isPlaceholder(contact.email) || !contact.email.trim()) return undefined;
  return `mailto:${contact.email.trim()}`;
}
