import {
  company,
  contact,
  containsPlaceholder,
  faq,
  isPlaceholder,
  seo,
  services,
  site,
} from '../config/site';

/**
 * ============================================================================
 *  SEO: cím, meta leírás, Open Graph, strukturált adat
 * ============================================================================
 *
 *  ALAPELV: kizárólag ténylegesen kitöltött adat kerül ki. A Google a
 *  helyőrzős vagy valótlan strukturált adatot büntetheti, ezért minden
 *  `[HELYŐRZŐ]` értéket kihagyunk — ha pedig a lényegi adat hiányzik,
 *  inkább nem adunk ki sémát egyáltalán.
 * ============================================================================
 */

/** A böngészőfülre és a találati listába kerülő cím. */
export function pageTitle(): string {
  if (!isPlaceholder(seo.title)) return seo.title;

  /* Tartalék, amíg a seo.title nincs kitöltve. Ugyanaz a szöveg, mint az
     index.html statikus címe, hogy ne váltson betöltés közben. */
  const base = 'Nyílászárócsere és beépítés';
  return isPlaceholder(company.name)
    ? base
    : `${base} – ${company.name}`;
}

/** A meta description és az Open Graph leírás. */
export function pageDescription(): string {
  if (!isPlaceholder(seo.description)) return seo.description;
  return company.intro;
}

/**
 * LocalBusiness séma a helyi keresésekhez, a kínált szolgáltatások
 * listájával. Cégnév nélkül nincs értelme — ilyenkor null.
 */
export function buildBusinessSchema(): Record<string, unknown> | null {
  if (isPlaceholder(company.name)) return null;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: company.name,
    url: site.url,
    description: company.intro,
    image: new URL(site.ogImage, site.url).href,
    serviceType: company.mainService,
  };

  if (!isPlaceholder(contact.phoneDisplay)) data.telephone = contact.phoneDisplay;
  if (!isPlaceholder(contact.email)) data.email = contact.email;
  if (!isPlaceholder(company.serviceArea)) {
    data.areaServed = { '@type': 'Place', name: company.serviceArea };
  }
  if (contact.address && !isPlaceholder(contact.address)) {
    data.address = { '@type': 'PostalAddress', streetAddress: contact.address };
  }
  if (contact.hours && !isPlaceholder(contact.hours)) data.openingHours = contact.hours;

  data.hasOfferCatalog = {
    '@type': 'OfferCatalog',
    name: 'Szolgáltatások',
    itemListElement: services.items.map((item) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: item.title, description: item.body },
    })),
  };

  return data;
}

/**
 * GYIK séma. Csak akkor kerül ki, ha egyetlen válasz sem tartalmaz
 * kitöltetlen helyőrzőt — kitöltetlen ár vagy garancia a találati
 * listában jelenne meg, ami rosszabb, mint ha nincs kiemelt találat.
 */
export function buildFaqSchema(): Record<string, unknown> | null {
  const usable = faq.items.filter(
    (item) => !containsPlaceholder(item.q) && !containsPlaceholder(item.a),
  );
  if (usable.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: usable.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/**
 * A dokumentum fejlécének beállítása. Nincs hozzá külső könyvtár
 * (react-helmet és társai) — ez a pár sor mindent lefed, amire itt kell.
 */
export function applyDocumentHead(): void {
  const title = pageTitle();
  const description = pageDescription();

  document.title = title;

  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', site.url);
  setMeta('property', 'og:locale', site.locale);
  setMeta('property', 'og:image', new URL(site.ogImage, site.url).href);
  setMeta('property', 'og:image:alt', title);
  if (!isPlaceholder(company.name)) setMeta('property', 'og:site_name', company.name);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);

  setJsonLd('ld-business', buildBusinessSchema());
  setJsonLd('ld-faq', buildFaqSchema());
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

function setJsonLd(id: string, data: Record<string, unknown> | null): void {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  const script = (existing as HTMLScriptElement | null) ?? document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
}
