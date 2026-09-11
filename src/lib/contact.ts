import { contact, isFilled } from '../config/site';

/** Egy szám `tel:` hivatkozássá alakítása. Üres, ha nincs valós érték. */
function toTel(raw: string, fallback: string): string | undefined {
  const value = isFilled(raw) ? raw : fallback;
  if (!isFilled(value)) return undefined;
  const cleaned = value.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : undefined;
}

/**
 * Az elsődleges telefonszám `tel:` hivatkozása.
 * `undefined`, ha a szám még kitöltetlen helyőrző — ilyenkor a felület
 * szöveget mutat link helyett, hogy ne legyen működésképtelen gomb.
 */
export function telHref(): string | undefined {
  return toTel(contact.phoneHref, contact.phoneDisplay);
}

/** A másodlagos telefonszám `tel:` hivatkozása, ha meg van adva. */
export function telHrefSecondary(): string | undefined {
  return toTel(contact.phoneSecondaryHref, contact.phoneSecondaryDisplay);
}

/** Van-e egyáltalán megadva második szám. */
export function hasSecondaryPhone(): boolean {
  return isFilled(contact.phoneSecondaryDisplay);
}

/** Ugyanez az e-mail-címre. */
export function mailHref(): string | undefined {
  if (!isFilled(contact.email)) return undefined;
  return `mailto:${contact.email.trim()}`;
}
