import { contact, isPlaceholder } from '../config/site';

/**
 * A telefonszám `tel:` hivatkozássá alakítása.
 * `undefined`, ha a szám még kitöltetlen helyőrző — ilyenkor a felület
 * szöveget mutat link helyett, hogy ne legyen működésképtelen gomb.
 */
export function telHref(which: 1 | 2 = 1): string | undefined {
  const href = which === 2 ? contact.phoneHref2 : contact.phoneHref;
  const display = which === 2 ? contact.phoneDisplay2 : contact.phoneDisplay;
  const raw = isPlaceholder(href) || !href.trim() ? display : href;
  if (isPlaceholder(raw) || !raw.trim()) return undefined;
  const cleaned = raw.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : undefined;
}

/** Ugyanez az e-mail-címre. */
export function mailHref(): string | undefined {
  if (isPlaceholder(contact.email) || !contact.email.trim()) return undefined;
  return `mailto:${contact.email.trim()}`;
}
