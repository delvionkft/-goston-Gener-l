import { activeServices, company, contact, isFilled, site } from '../config/site';

/** A `{ceg}` helyőrző feloldása a cégnévvel. */
function resolve(template: string): string {
  const name = isFilled(company.name) ? company.name : '';
  return template.replace('{ceg}', name).replace(/^\s*[—–-]\s*/, '').trim();
}

export function pageTitle(): string {
  return isFilled(company.name)
    ? resolve(site.title)
    : 'Nyílászáró landing oldal — töltsd ki a cégadatokat';
}

export function pageDescription(): string {
  return site.description;
}

/**
 * LocalBusiness strukturált adat.
 *
 * A `HomeAndConstructionBusiness` a LocalBusiness altípusa, így a
 * LocalBusiness elvárásait teljesíti, de pontosabban írja le a
 * tevékenységet.
 *
 * FONTOS: kizárólag a ténylegesen kitöltött mezőket adjuk ki. A Google a
 * hamis vagy helyőrző adatot tartalmazó strukturált adatot büntetheti,
 * ezért minden `[HELYŐRZŐ]` értéket kihagyunk. Ha a cégnév sincs kitöltve,
 * egyáltalán nem generálunk sémát.
 */
export function buildStructuredData(): string | null {
  if (!isFilled(company.name)) return null;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: company.name,
    url: site.url,
    description: site.description,
    image: new URL(site.ogImage, site.url).href,
  };

  if (isFilled(company.legalName)) data.legalName = company.legalName;
  /* A schema.org telephone mezője több értéket is elfogad tömbként. */
  const phones = [contact.phoneDisplay, contact.phoneSecondaryDisplay].filter(isFilled);
  if (phones.length === 1) data.telephone = phones[0];
  else if (phones.length > 1) data.telephone = phones;
  if (isFilled(contact.email)) data.email = contact.email;
  if (isFilled(company.taxNumber)) data.taxID = company.taxNumber;

  if (isFilled(company.serviceArea)) {
    data.areaServed = { '@type': 'Place', name: company.serviceArea };
  }

  /* A cím csak akkor kerül be, ha van valós érték — a séma addressLocality
     nélkül is érvényes, üres mezőkkel viszont hibás lenne. */
  const street = isFilled(contact.address) ? contact.address : company.seat;
  if (isFilled(street)) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressCountry: 'HU',
    };
  }

  if (isFilled(contact.hours)) data.openingHours = contact.hours;

  /* A kínált szolgáltatások — csak a ténylegesen bekapcsoltak. */
  if (activeServices.length > 0) {
    data.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Szolgáltatások',
      itemListElement: activeServices.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.label, description: service.summary },
      })),
    };
  }

  return JSON.stringify(data);
}

/**
 * A dokumentum fejlécének beállítása. Nincs hozzá külső könyvtár
 * (react-helmet és társai) — ez a pár sor mindent lefed, amire itt szükség van.
 */
export function applyDocumentHead(): void {
  const title = pageTitle();
  const description = pageDescription();
  const ogImage = new URL(site.ogImage, site.url).href;

  document.title = title;

  setMeta('name', 'description', description);
  setMeta('property', 'og:site_name', isFilled(company.name) ? company.name : title);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', site.url);
  setMeta('property', 'og:locale', site.locale);
  setMeta('property', 'og:image', ogImage);
  setMeta('property', 'og:image:alt', title);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', ogImage);

  setCanonical(site.url);

  // Strukturált adat — csak valós mezőkből
  const json = buildStructuredData();
  const existing = document.getElementById('ld-json') as HTMLScriptElement | null;
  if (json) {
    const script = existing ?? document.createElement('script');
    script.id = 'ld-json';
    script.type = 'application/ld+json';
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

function setCanonical(url: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}
