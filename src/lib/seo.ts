import { company, contact, isPlaceholder, site } from '../config/site';

/**
 * LocalBusiness / ProfessionalService strukturált adat.
 *
 * FONTOS: kizárólag a ténylegesen kitöltött mezőket adjuk ki. A Google
 * a hamis vagy helyőrző adatot tartalmazó strukturált adatot büntetheti,
 * ezért minden `[HELYŐRZŐ]` értéket kihagyunk a kimenetből. Ha a cégnév
 * sincs kitöltve, egyáltalán nem generálunk sémát.
 */
export function buildStructuredData(): string | null {
  if (isPlaceholder(company.name)) return null;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: company.name,
    url: site.url,
  };

  if (!isPlaceholder(company.intro)) data.description = company.intro;
  if (!isPlaceholder(company.mainService)) {
    data.knowsAbout = company.mainService;
    data.serviceType = company.mainService;
  }
  if (!isPlaceholder(contact.phoneDisplay)) data.telephone = contact.phoneDisplay;
  if (!isPlaceholder(contact.email)) data.email = contact.email;
  if (!isPlaceholder(company.serviceArea)) {
    data.areaServed = { '@type': 'Place', name: company.serviceArea };
  }
  if (contact.address && !isPlaceholder(contact.address)) {
    data.address = { '@type': 'PostalAddress', streetAddress: contact.address };
  }
  if (contact.hours && !isPlaceholder(contact.hours)) {
    data.openingHours = contact.hours;
  }

  return JSON.stringify(data);
}

/**
 * A dokumentum fejlécének beállítása. Nincs hozzá külső könyvtár
 * (react-helmet és társai) — ez a pár sor mindent lefed, amire itt szükség van.
 */
export function applyDocumentHead(): void {
  const title = isPlaceholder(company.name)
    ? 'Landing oldal — töltsd ki a cégadatokat'
    : `${company.name}${isPlaceholder(company.mainService) ? '' : ` – ${company.mainService}`}`;

  document.title = title;

  const description = isPlaceholder(company.intro)
    ? 'Ajánlatkérés néhány kattintással.'
    : company.intro;

  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', site.url);
  setMeta('property', 'og:locale', site.locale);
  setMeta('property', 'og:image', new URL(site.ogImage, site.url).href);
  setMeta('name', 'twitter:card', 'summary_large_image');

  // Strukturált adat — csak valós mezőkből
  const json = buildStructuredData();
  const existing = document.getElementById('ld-json');
  if (json) {
    const script = (existing as HTMLScriptElement | null) ?? document.createElement('script');
    script.id = 'ld-json';
    (script as HTMLScriptElement).type = 'application/ld+json';
    script.textContent = json;
    if (!existing) document.head.appendChild(script);
  } else {
    existing?.remove();
  }
}

function setMeta(attr: 'name' | 'property', key: string, value: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
}
