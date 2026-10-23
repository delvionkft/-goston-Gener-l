/**
 * ============================================================================
 *  E-MAIL ÉRTESÍTÉS (EmailJS)
 * ============================================================================
 *
 *  Az ajánlatkérésről a böngésző küld e-mailt az EmailJS-en keresztül.
 *  Ezek a kulcsok SZÁNDÉKOSAN nyilvánosak: az EmailJS nyilvános kulcsa
 *  arra való, hogy kliensoldali kódban szerepeljen. Visszaélés ellen az
 *  EmailJS felületén a megengedett domaineket kell szűkíteni
 *  (Account → Security → Allowed origins) — EZT ÁLLÍTSD BE ÉLESÍTÉSKOR,
 *  különben más oldalról is küldhetnek a te kvótád terhére.
 *
 *  A sablon változónevei: lásd a `toTemplateParams()` függvényt a
 *  src/lib/submitLead.ts fájlban. A sablonban pontosan ezekre a nevekre
 *  kell hivatkozni, különben üresen marad a mező.
 * ============================================================================
 */

export const emailjs = {
  /** Küldő szolgáltatás (Email Services → Service ID). */
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_7nks6ft',
  /** A „Kapcsolat" sablon azonosítója (Email Templates → Template ID). */
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_pk6jr1c',
  /** Nyilvános kulcs (Account → General → Public Key). */
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'RShIL21qRzcdn28yQ',
  /** Az EmailJS böngészős végpontja. */
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
} as const;

/** Igaz, ha mindhárom azonosító ki van töltve. */
export const emailEnabled =
  Boolean(emailjs.serviceId) && Boolean(emailjs.templateId) && Boolean(emailjs.publicKey);
