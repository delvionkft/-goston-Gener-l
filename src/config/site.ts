/**
 * ============================================================================
 *  EGYETLEN SZERKESZTENDŐ FÁJL A TARTALOMHOZ
 * ============================================================================
 *
 *  Az oldal minden cégspecifikus adata és szövege itt van. A komponensek
 *  semmilyen üzleti adatot nem tartalmaznak hardcode-olva.
 *
 *  HOGYAN VEDD HASZNÁLATBA:
 *  1. Cseréld ki lentebb a `PLACEHOLDER(...)` értékeket valós adatokra.
 *  2. Amíg egy érték helyőrző, az oldalon szögletes zárójelben, kiemelve
 *     jelenik meg (pl. [CÉGNÉV]), fejlesztői módban sárga háttérrel — így
 *     nem lehet véletlenül kitöltetlenül élesíteni.
 *  3. A `npm run check:content` parancs kilistázza az összes még kitöltetlen
 *     helyőrzőt, és hibával kilép, ha maradt ilyen.
 *
 *  NE tegyél ide kitalált referenciát, statisztikát, garanciát vagy
 *  ügyfélvéleményt. Ami nincs meg, az maradjon helyőrző.
 * ============================================================================
 */

/** Helyőrző-jelölő. Amíg egy mező ilyen, nincs valós adattal kitöltve. */
export const PLACEHOLDER_PREFIX = '[';

export type MaybePlaceholder = string;

/** Igaz, ha az érték még kitöltetlen helyőrző. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === 'string' && /^\[.+\]$/.test(value.trim());
}

/* ---------------------------------------------------------------------------
 * 1. ALAPADATOK  — ezeket cseréld ki először
 * ------------------------------------------------------------------------ */

export const company = {
  /** Cég teljes neve, ahogy a fejlécben és a footerben megjelenik. */
  name: '[CÉGNÉV]' as MaybePlaceholder,
  /** Rövid név / logószöveg. Ha üres, a `name` kerül a helyére. */
  shortName: '[CÉGNÉV]' as MaybePlaceholder,
  /** A fő szolgáltatás egy szóban vagy rövid kifejezésben. Pl. „lakásfelújítás”. */
  mainService: '[FŐ SZOLGÁLTATÁS]' as MaybePlaceholder,
  /** 1–2 mondatos bemutatkozás. Ez kerül a hero alá és a meta descriptionbe. */
  intro: '[RÖVID BEMUTATKOZÁS]' as MaybePlaceholder,
  /** Szolgáltatási terület, pl. „Budapest és Pest vármegye”. */
  serviceArea: '[SZOLGÁLTATÁSI TERÜLET]' as MaybePlaceholder,
} as const;

export const contact = {
  /** Megjelenített telefonszám. */
  phoneDisplay: '[TELEFONSZÁM]' as MaybePlaceholder,
  /**
   * Tárcsázható formátum a `tel:` linkhez. Nemzetközi formában, szóköz nélkül.
   * Pl. '+36301234567'. Amíg helyőrző, a gomb nem tel: linkként viselkedik.
   */
  phoneHref: '[TELEFONSZÁM]' as MaybePlaceholder,
  email: '[E-MAIL-CÍM]' as MaybePlaceholder,
  /** Opcionális postai cím a footerhez és a structured datához. Hagyd üresen, ha nincs. */
  address: '' as MaybePlaceholder,
  /** Nyitvatartás / elérhetőségi idő rövid szövege. Hagyd üresen, ha nincs. */
  hours: '' as MaybePlaceholder,
} as const;

export const site = {
  /** Éles URL. A canonical linkhez és az Open Graph adatokhoz kell. */
  url: 'https://example.hu',
  /** Böngészőfül és Open Graph cím. */
  title: `${company.name} – ${company.mainService}`,
  locale: 'hu_HU',
  /** OG kép elérési útja a /public mappához képest. Cseréld le valós képre. */
  ogImage: '/og-image.png',
} as const;

/* ---------------------------------------------------------------------------
 * 2. NAVIGÁCIÓ
 * ------------------------------------------------------------------------ */

export const navLinks = [
  { id: 'szolgaltatas', label: 'Szolgáltatás' },
  { id: 'referenciak', label: 'Referenciák' },
  { id: 'folyamat', label: 'Folyamat' },
  { id: 'kapcsolat', label: 'Kapcsolat' },
] as const;

/** Az ajánlatkérő űrlapok horgonyai. */
export const ANCHOR = {
  hero: 'fooldal',
  quickForm: 'ajanlatkeres',
  problem: 'miert',
  solution: 'szolgaltatas',
  references: 'referenciak',
  process: 'folyamat',
  finalForm: 'kapcsolat',
} as const;

/* ---------------------------------------------------------------------------
 * 3. HERO
 * ------------------------------------------------------------------------ */

export const hero = {
  eyebrow: company.serviceArea,
  /**
   * Főcím. Kerüld az általános szlogeneket. Mondd ki, mit csinálsz és kinek.
   * A `highlight` rész kap vizuális kiemelést.
   */
  titleBefore: 'Kiszámítható ',
  titleHighlight: company.mainService,
  titleAfter: ' — üres ígéretek nélkül.',
  lead: company.intro,
  primaryCta: 'Ajánlatot kérek',
  secondaryCta: 'Hívlak most',
  /**
   * Négy rövid, ellenőrizhető állítás. Csak olyat írj ide, ami tényleg igaz
   * a cégre. Ha nincs adat, maradjon helyőrző.
   */
  points: [
    { title: '[ELŐNY 1]', text: '[Rövid magyarázat, egy mondat.]' },
    { title: '[ELŐNY 2]', text: '[Rövid magyarázat, egy mondat.]' },
    { title: '[ELŐNY 3]', text: '[Rövid magyarázat, egy mondat.]' },
    { title: '[ELŐNY 4]', text: '[Rövid magyarázat, egy mondat.]' },
  ],
  /**
   * Hero kép. Tedd a fájlt a /public mappába és írd ide az útvonalát,
   * pl. '/hero.jpg'. Amíg üres, egy jelölt képhelyőrző jelenik meg.
   * Ajánlott méret: 1200×1500 px, WebP vagy AVIF, 200 kB alatt.
   */
  image: '',
  imageAlt: '[Képaláírás: mit ábrázol a kép]',
} as const;

/* ---------------------------------------------------------------------------
 * 4. ŰRLAP
 * ------------------------------------------------------------------------ */

export const form = {
  quick: {
    title: 'Kérj ajánlatot két percben',
    lead: 'Írd le pár mondatban, mire van szükséged. Nem kell pontos műszaki leírás — a részleteket úgyis átbeszéljük.',
  },
  final: {
    title: 'Beszéljük át, mire van szükséged',
    lead: 'Küldd el az adataidat, és visszahívunk. Ha gyorsabb, hívj minket közvetlenül.',
  },
  /** Az „mi történik ezután” blokk pontjai az űrlap mellett. */
  afterSubmit: [
    'Megnézzük, amit írtál, és tisztázzuk a nyitott kérdéseket.',
    'Felvesszük veled a kapcsolatot a megadott elérhetőségen.',
    'Ha kell, helyszíni felmérést egyeztetünk.',
  ],
  /** Szolgáltatásválasztó opciói. Cseréld a valós szolgáltatásokra. */
  serviceOptions: [
    '[SZOLGÁLTATÁS 1]',
    '[SZOLGÁLTATÁS 2]',
    '[SZOLGÁLTATÁS 3]',
    'Egyéb / még nem tudom',
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 5. PROBLÉMA SZEKCIÓ
 * ------------------------------------------------------------------------ */

export const problem = {
  eyebrow: 'A helyzet',
  title: 'A legtöbb bosszúság nem a munkából jön, hanem a körülötte lévő káoszból',
  lead: 'A szakmai rész általában megoldható. Ami elviszi az energiát, az a bizonytalanság: mikor, mennyiért, ki felel érte. Válaszd ki, ami nálad a legismerősebb.',
  /** 3–4 konkrét fájdalompont. Ne dramatizáld — konkrét helyzeteket írj le. */
  items: [
    {
      key: 'arak',
      label: 'Átláthatatlan árak',
      title: 'Az ajánlatból nem derül ki, mi fér bele',
      body: '[Írd le konkrétan, milyen árazási bizonytalansággal találkoznak az ügyfeleid, mielőtt hozzád fordulnak.]',
    },
    {
      key: 'hatarido',
      label: 'Csúszó határidők',
      title: 'A vállalt dátum és a valóság elválik',
      body: '[Írd le, milyen határidő-problémákat tapasztalnak az ügyfeleid.]',
    },
    {
      key: 'kommunikacio',
      label: 'Néma szakasz',
      title: 'Az ügyfél nem tudja, hol tart a munka',
      body: '[Írd le, milyen kommunikációs hiányt élnek meg az ügyfeleid.]',
    },
    {
      key: 'felelosseg',
      label: 'Elmosódó felelősség',
      title: 'Baj esetén nincs, aki felvegye a telefont',
      body: '[Írd le, milyen felelősségvállalási problémákkal találkoznak.]',
    },
  ],
  cta: 'Nézzük, nálad hogy lehet ezt elkerülni',
} as const;

/* ---------------------------------------------------------------------------
 * 6. MEGOLDÁS / SZOLGÁLTATÁS
 * ------------------------------------------------------------------------ */

export const solution = {
  eyebrow: 'Amit csinálunk',
  title: `${company.mainService} — elejétől a végéig egy kézben`,
  lead: company.intro,
  body: '[Írd le 2–4 mondatban részletesebben, hogyan dolgoztok: mit vállaltok, mit nem, hogyan tartjátok a kapcsolatot az ügyféllel.]',
  /**
   * Interaktív fülek. Minden fülhöz tartozik egy cím, leírás és
   * 3 kiemelt pont. Az `image` opcionális: tedd a fájlt a /public-ba.
   */
  tabs: [
    {
      key: 'tab-1',
      label: '[SZOLGÁLTATÁS 1]',
      title: '[SZOLGÁLTATÁS 1 — mit takar]',
      body: '[Írd le, pontosan mit tartalmaz ez a szolgáltatás, és kinek való.]',
      bullets: ['[Konkrét részlet]', '[Konkrét részlet]', '[Konkrét részlet]'],
      image: '',
      imageAlt: '[Képaláírás]',
    },
    {
      key: 'tab-2',
      label: '[SZOLGÁLTATÁS 2]',
      title: '[SZOLGÁLTATÁS 2 — mit takar]',
      body: '[Írd le, pontosan mit tartalmaz ez a szolgáltatás, és kinek való.]',
      bullets: ['[Konkrét részlet]', '[Konkrét részlet]', '[Konkrét részlet]'],
      image: '',
      imageAlt: '[Képaláírás]',
    },
    {
      key: 'tab-3',
      label: '[SZOLGÁLTATÁS 3]',
      title: '[SZOLGÁLTATÁS 3 — mit takar]',
      body: '[Írd le, pontosan mit tartalmaz ez a szolgáltatás, és kinek való.]',
      bullets: ['[Konkrét részlet]', '[Konkrét részlet]', '[Konkrét részlet]'],
      image: '',
      imageAlt: '[Képaláírás]',
    },
  ],
  cta: 'Kérj rá ajánlatot',
} as const;

/* ---------------------------------------------------------------------------
 * 7. REFERENCIÁK
 *
 *  FONTOS: ide csak valós, elvégzett munkák kerülhetnek. Amíg nincs
 *  referenciaanyag, hagyd a helyőrzőket — kitalált projekt megtévesztő.
 * ------------------------------------------------------------------------ */

export const references = {
  eyebrow: 'Munkáink',
  title: 'Néhány elkészült munka',
  lead: '[Rövid felvezető: milyen jellegű munkákat mutattok itt be.]',
  items: [
    {
      id: 'ref-1',
      title: '[PROJEKT CÍME]',
      location: '[HELYSZÍN]',
      description: '[Rövid leírás: mi volt a feladat és mi készült el.]',
      image: '',
      imageAlt: '[REFERENCIAKÉP leírása]',
    },
    {
      id: 'ref-2',
      title: '[PROJEKT CÍME]',
      location: '[HELYSZÍN]',
      description: '[Rövid leírás: mi volt a feladat és mi készült el.]',
      image: '',
      imageAlt: '[REFERENCIAKÉP leírása]',
    },
    {
      id: 'ref-3',
      title: '[PROJEKT CÍME]',
      location: '[HELYSZÍN]',
      description: '[Rövid leírás: mi volt a feladat és mi készült el.]',
      image: '',
      imageAlt: '[REFERENCIAKÉP leírása]',
    },
    {
      id: 'ref-4',
      title: '[PROJEKT CÍME]',
      location: '[HELYSZÍN]',
      description: '[Rövid leírás: mi volt a feladat és mi készült el.]',
      image: '',
      imageAlt: '[REFERENCIAKÉP leírása]',
    },
    {
      id: 'ref-5',
      title: '[PROJEKT CÍME]',
      location: '[HELYSZÍN]',
      description: '[Rövid leírás: mi volt a feladat és mi készült el.]',
      image: '',
      imageAlt: '[REFERENCIAKÉP leírása]',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 8. FOLYAMAT
 * ------------------------------------------------------------------------ */

export const process = {
  eyebrow: 'Hogyan dolgozunk',
  title: 'Hat lépés a megkereséstől az átadásig',
  lead: 'Így néz ki egy munka nálunk, az első hívástól a kész eredményig.',
  steps: [
    { title: 'Kapcsolatfelvétel', body: '[Mi történik ebben a lépésben? Hogyan és mikor reagáltok?]' },
    { title: 'Egyeztetés', body: '[Mit beszéltek át? Telefonon vagy személyesen?]' },
    { title: 'Felmérés', body: '[Hogyan zajlik a helyszíni felmérés vagy igényfelmérés?]' },
    { title: 'Ajánlat', body: '[Mit tartalmaz az ajánlat, és mennyi idő alatt készül el?]' },
    { title: 'Kivitelezés', body: '[Hogyan zajlik a munka? Hogyan tájékoztatjátok az ügyfelet?]' },
    { title: 'Átadás', body: '[Mi történik a befejezéskor? Van-e utókövetés?]' },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 9. ZÁRÓ SZEKCIÓ
 * ------------------------------------------------------------------------ */

export const finalCta = {
  eyebrow: 'Kapcsolat',
  title: 'Mondd el, mire van szükséged',
  lead: 'Nem kell kész tervvel érkezned. Írd le, mi a helyzet, és megmondjuk, mit tudunk kezdeni vele.',
} as const;

/* ---------------------------------------------------------------------------
 * 10. FOOTER ÉS JOGI SZÖVEGEK
 * ------------------------------------------------------------------------ */

export const legal = {
  /**
   * A jogi szövegek modális ablakban jelennek meg. Cseréld a valós,
   * jogásszal ellenőrzött szövegre. Ha külön aloldalra tennéd őket,
   * add meg az `href` értéket — akkor linkként fog viselkedni.
   */
  privacy: {
    title: 'Adatkezelési tájékoztató',
    href: '',
    body: '[Ide kerül a teljes adatkezelési tájékoztató. Tartalmaznia kell legalább: az adatkezelő nevét és elérhetőségét, a kezelt adatok körét, az adatkezelés célját és jogalapját, a megőrzési időt, az adatfeldolgozókat, és az érintett jogait. Jogi ellenőrzés nélkül ne élesítsd.]',
  },
  imprint: {
    title: 'Impresszum',
    href: '',
    body: '[Ide kerül az impresszum: cégnév, székhely, cégjegyzékszám, adószám, képviselő neve, elérhetőségek, tárhelyszolgáltató adatai.]',
  },
} as const;

export const cookies = {
  title: 'Sütik használata',
  body: 'A működéshez szükséges sütiket mindig használjuk. A statisztikai és marketingsütiket csak a hozzájárulásoddal.',
  categories: [
    {
      key: 'necessary' as const,
      label: 'Működéshez szükséges',
      description: 'Az oldal alapvető működéséhez kell. Nem kapcsolható ki.',
      required: true,
    },
    {
      key: 'analytics' as const,
      label: 'Statisztika',
      description: 'Névtelen látogatottsági adatok, hogy lássuk, mi működik az oldalon.',
      required: false,
    },
    {
      key: 'marketing' as const,
      label: 'Marketing',
      description: 'Hirdetési mérés és remarketing.',
      required: false,
    },
  ],
} as const;
