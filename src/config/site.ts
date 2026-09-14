/**
 * ============================================================================
 *  EGYETLEN SZERKESZTENDŐ FÁJL A TARTALOMHOZ
 * ============================================================================
 *
 *  Az oldal minden cégspecifikus adata és szövege itt van. A komponensek
 *  semmilyen üzleti adatot nem tartalmaznak hardcode-olva.
 *
 *  HOGYAN VEDD HASZNÁLATBA:
 *  1. Cseréld ki a szögletes zárójeles helyőrzőket valós adatokra.
 *  2. Amíg egy érték helyőrző, az oldalon megjelölve jelenik meg
 *     (fejlesztői módban sárga kiemeléssel) — így nem lehet véletlenül
 *     kitöltetlenül élesíteni.
 *  3. A `npm run check:content` kilistázza az összes maradék helyőrzőt,
 *     és hibával lép ki, ha maradt ilyen.
 *
 *  NE tegyél ide kitalált árat, határidőt, garanciát, referenciát,
 *  ügyfélvéleményt vagy statisztikát. Ami nincs meg, az maradjon helyőrző.
 * ============================================================================
 */

export type MaybePlaceholder = string;

/** Igaz, ha az érték még kitöltetlen helyőrző, pl. `[CÉGNÉV]`. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === 'string' && /^\[.+\]$/.test(value.trim());
}

/** Igaz, ha a szövegben bárhol van kitöltetlen helyőrző-részlet. */
export function containsPlaceholder(value: string | undefined | null): boolean {
  return typeof value === 'string' && /\[[^\]]+\]/.test(value);
}

/* ---------------------------------------------------------------------------
 * 1. ALAPADATOK — ezeket cseréld ki először
 * ------------------------------------------------------------------------ */

export const company = {
  /** Cég teljes neve, ahogy a fejlécben és a footerben megjelenik. */
  name: 'Ágoston-Generál Kft.',
  /** Rövid név / logószöveg a fejléchez. */
  shortName: 'Ágoston-Generál',
  /** A fő szolgáltatás rövid megnevezése. Ez kerül a meta titlebe is. */
  mainService: 'nyílászárócsere és beépítés',
  /** 1–2 mondatos bemutatkozás. A meta descriptionbe is ez kerül. */
  intro:
    'Ablakok és ajtók cseréje és beépítése a Balaton déli partján: felmérés, beszerzés, bontás, beépítés és helyreállítás egy kézből, 25 év építőipari tapasztalattal.',
  /** Szolgáltatási terület — a footerben és a strukturált adatban. */
  serviceArea: 'Balaton déli partja — Keszthely, Marcali, Balatonboglár, Fonyód térsége',
  /** Rövid változat szűk helyre (hero címke, lebegő kártya). */
  serviceAreaShort: 'Balaton déli partja',
  /**
   * Logó a fejlécbe és a footerbe (a /public mappából).
   * Ha ki van töltve, a cégnév szövege helyette a logóban jelenik meg —
   * a képernyőolvasó továbbra is megkapja.
   *
   * FONTOS: a képútvonalak kezdő perjel NÉLKÜL szerepelnek. Így az oldal
   * akkor is megtalálja a fájlokat, ha nem a domain gyökeréből szolgáljuk
   * ki (előnézet, aloldal, alkönyvtár).
   */
  logo: 'agoston-general-gold-logo.webp',
} as const;

export const contact = {
  /**
   * A nyilvános telefonszám — Böröndi Szabina irodavezető.
   * Szándékosan csak egy szám van kint: az ügyvezetői számot nem
   * hirdetjük az oldalon.
   */
  phoneDisplay: '+36 70 547 9595',
  /** Tárcsázható formátum a `tel:` linkhez, szóköz nélkül. */
  phoneHref: '+36705479595',
  /** Kihez tartozik a szám — a footerben a szám alatt jelenik meg. */
  phoneLabel: 'Böröndi Szabina, irodavezető',
  /**
   * Második szám. Üresen hagyva sehol nem jelenik meg — jelenleg
   * szándékosan üres.
   */
  phoneDisplay2: '',
  phoneHref2: '',
  phoneLabel2: '',
  email: 'agostongeneral@gmail.com',
  /** Székhely. Üresen hagyva nem jelenik meg. */
  address: '8648 Balatonkeresztúr, Iskola utca 4/I',
  /** Elérhetőségi idő rövid szövege. Ha üres, nem jelenik meg. */
  hours: '',
} as const;

/**
 * Közösségi média. Csak a kitöltött elemek jelennek meg a footerben —
 * az üres `href` mezőjű sorokat az oldal kihagyja.
 */
export const social = [
  { label: 'Facebook', href: 'https://www.facebook.com/agoston.general.kft' },
  { label: 'Instagram', href: '' },
] as const;

export const site = {
  /** Éles URL. A canonical linkhez és az Open Graph adatokhoz kell. */
  url: 'https://agostongeneral.hu',
  locale: 'hu_HU',
  /** OG kép a /public mappában. Ajánlott: 1200×630 px. */
  ogImage: '/og-image.png',
} as const;

/**
 * Meta címke szövegek. Ezek kerülnek a böngészőfülre, a Google
 * találati listájába és a közösségi megosztás előnézetébe.
 */
export const seo = {
  title: 'Nyílászáró csere és beépítés – Ágoston-Generál Kft.',
  description:
    'Ablak- és ajtócsere, beépítés a Balaton déli partján, Keszthely–Marcali–Balatonboglár–Fonyód térségében. VEKA nyílászárók, bontás és helyreállítás egy kézből.',
} as const;

/* ---------------------------------------------------------------------------
 * 2. CTA-SZÖVEGEK
 *
 *  Szándékosan kevés változat van: a látogatónak végig ugyanazt az egy
 *  ígéretet kell látnia. Ha átírod, itt írd át — az egész oldalon frissül.
 * ------------------------------------------------------------------------ */

export const cta = {
  /** A fő ajánlatkérő gomb szövege mindenhol. */
  primary: 'Ajánlatot kérek',
  /** Rövidített változat szűk helyre (fejléc, mobil sáv). */
  short: 'Ajánlatkérés',
  /** A hero másodlagos gombja. */
  secondary: 'Megnézem a szolgáltatásokat',
} as const;

/* ---------------------------------------------------------------------------
 * 3. NAVIGÁCIÓ ÉS HORGONYOK
 * ------------------------------------------------------------------------ */

export const ANCHOR = {
  hero: 'fooldal',
  /** A hero alatti, rövid ajánlatkérő. Nem számozott szekció. */
  quickForm: 'ajanlatkeres-fent',
  problem: 'problemak',
  services: 'szolgaltatasok',
  calculator: 'kalkulator',
  why: 'miert-minket',
  process: 'folyamat',
  references: 'referenciak',
  testimonials: 'velemenyek',
  faq: 'gyik',
  form: 'ajanlatkeres',
} as const;

export const navLinks = [
  { id: ANCHOR.services, label: 'Szolgáltatások' },
  { id: ANCHOR.calculator, label: 'Kalkulátor' },
  { id: ANCHOR.why, label: 'Miért minket' },
  { id: ANCHOR.process, label: 'Folyamat' },
  { id: ANCHOR.references, label: 'Referenciák' },
  { id: ANCHOR.faq, label: 'Kérdések' },
] as const;

/**
 * A számozott szekciók sorrendben. Ebből jön a jobb felső sarokban látható
 * sorszám (01, 02…), a tartalomjegyzék és a fejléc menüje is — így nem
 * csúszhatnak szét egymástól.
 */
export const SECTIONS = [
  { id: ANCHOR.problem, label: 'Problémák' },
  { id: ANCHOR.services, label: 'Szolgáltatások' },
  { id: ANCHOR.calculator, label: 'Kalkulátor' },
  { id: ANCHOR.why, label: 'Miért minket' },
  { id: ANCHOR.process, label: 'Folyamat' },
  { id: ANCHOR.references, label: 'Referenciák' },
  { id: ANCHOR.testimonials, label: 'Vélemények' },
  { id: ANCHOR.faq, label: 'Kérdések' },
  { id: ANCHOR.form, label: 'Ajánlatkérés' },
] as const;

/** Egy szekció kétjegyű sorszáma, pl. '03'. Ismeretlen azonosítóra üres. */
export function sectionNumber(id: string): string {
  const index = SECTIONS.findIndex((section) => section.id === id);
  return index < 0 ? '' : String(index + 1).padStart(2, '0');
}

/* ---------------------------------------------------------------------------
 * 4. HERO
 * ------------------------------------------------------------------------ */

export const hero = {
  eyebrow: company.serviceAreaShort,
  title: 'Modern nyílászárók, precíz beépítéssel',
  lead:
    'Segítünk megtalálni az otthonodhoz és igényeidhez illő megoldást, a felméréstől egészen a szakszerű beépítésig.',
  /**
   * Három rövid bizalmi elem a gombok alatt. Tartsd rövidre — ez nem
   * felsorolás, hanem első benyomás.
   */
  trust: [
    {
      title: 'Személyre szabott megoldások',
      text: 'VEKA profilrendszerek, igény esetén más gyártó terméke — az épület adottságaihoz igazítva.',
    },
    {
      title: 'Precíz helyszíni felmérés',
      text: 'Pontos méretek és szakmai tanácsadás. A felmérés díját megrendelés esetén jóváírjuk.',
    },
    {
      title: 'Mindent egy kézből',
      text: 'Felmérés, beszerzés, bontás, beépítés és helyreállítás — 25 év tapasztalattal.',
    },
  ],
  /**
   * A hero alatti képsáv. Három kép: középen a legerősebb (ez látszik
   * mobilon is elsőként), két oldalt egy-egy kiegészítő.
   *
   * A fájlokat a /public mappába kell feltölteni pontosan ezekkel a
   * nevekkel — amíg nincsenek ott, jelölt képhelyőrző látszik, nem törött
   * kép. Ajánlott: 1000×1250 px, WebP, 200 kB alatt.
   */
  gallery: [
    { image: 'hero-1.webp', alt: 'Világos nappali nagyméretű modern ablakokkal' },
    { image: 'hero-2.webp', alt: 'Beépített bejárati ajtó kívülről' },
    { image: 'hero-3.webp', alt: 'Nyílászáró beépítés közben, rendezett munkaterület' },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 4/B. SZÁMOK
 *
 *  Rövid, ellenőrizhető számok a hero alatt. Csak olyat tegyél ide, ami
 *  igaz és bizonyítható — a felfújt szám az első beszélgetésben lebukik.
 *  A 25 év és a 250 kivitelezés a korábbi agostongeneral.hu oldalról jön;
 *  ha időközben változott, írd át.
 * ------------------------------------------------------------------------ */

export const stats = [
  { value: 25, suffix: '+', label: 'év építőipari tapasztalat' },
  { value: 250, suffix: '+', label: 'befejezett kivitelezés' },
  { value: 14, suffix: '', label: 'település a szolgáltatási területen' },
] as const;

/* ---------------------------------------------------------------------------
 * 5. PROBLÉMAFELVETÉS
 * ------------------------------------------------------------------------ */

export const problem = {
  eyebrow: 'Ismerős helyzet?',
  title: 'Ismerősek ezek a problémák?',
  lead:
    'A legtöbb megkeresés ezek valamelyikével kezdődik. Ritkán egyetlen ablakról van szó — általában az egész szerkezet és a beépítés együtt okozza a gondot.',
  items: [
    {
      key: 'huzat',
      label: 'Huzatos ablakok',
      title: 'Huzatos vagy nehezen záródó ablakok',
      body:
        'A szárny megereszkedett, a tömítés elöregedett, a kilincs nehezen fordul. Ilyenkor hiába fűtesz: a meleg egy része a rossz záródáson keresztül távozik.',
    },
    {
      key: 'koltseg',
      label: 'Magas rezsi',
      title: 'Magas fűtési és hűtési költségek',
      body:
        'A régi, egyrétegű vagy sérült üvegezés és a hiányos hőszigetelés a homlokzat leggyengébb pontja. Nyáron ugyanez fordítva működik: a hűtés nem bírja tartani a hőt kívül.',
    },
    {
      key: 'parasodas',
      label: 'Párásodás',
      title: 'Párásodás vagy penészesedés',
      body:
        'Az ablak belső oldalán megjelenő pára és a sarkokban induló penész szinte mindig hideghídra vagy rossz beépítésre vezethető vissza — nem véletlenszerű hiba.',
    },
    {
      key: 'zaj',
      label: 'Gyenge hangszigetelés',
      title: 'Gyenge hangszigetelés',
      body:
        'Forgalmas út mellett vagy sűrűn beépített környéken az ablak hangszigetelése dönti el, mennyire lehet pihenni otthon. Ezen az üvegszerkezet és a beépítés is sokat javít.',
    },
    {
      key: 'elavult',
      label: 'Elavult szerkezet',
      title: 'Elavult, sérült szerkezetek',
      body:
        'A megvetemedett, korhadt vagy repedt szerkezetet egy ponton már nem éri meg javítgatni: a ráfordítás nem térül meg, a probléma pedig visszatér.',
    },
  ],
  /** A szekció zárógondolata — ez vezet át a megoldásra. */
  bridge:
    'A megoldás ezért ritkán csak „egy új ablak”. Az számít, hogy a megfelelő szerkezet kerüljön a megfelelő helyre, és hogy a beépítés is pontos legyen — enélkül a legjobb nyílászáró sem hozza, amit ígér.',
} as const;

/* ---------------------------------------------------------------------------
 * 6. SZOLGÁLTATÁSOK
 *
 *  Az `image` mező opcionális. Ha kitöltöd, a kártya tetején megjelenik a
 *  kép; ha üresen hagyod, a letisztult ikon marad — így az oldal fotók
 *  nélkül is rendezett.
 * ------------------------------------------------------------------------ */

export const services = {
  eyebrow: 'Szolgáltatások',
  title: 'Amiben segíteni tudunk',
  /** Ez a szó kap kézzel húzott aláhúzást a címben. Üresen hagyva nincs. */
  accent: 'segíteni',
  lead:
    'Egy helyen a teljes nyílászáró-kör: a nyílászárótól az árnyékoláson át a beépítésig és a helyreállításig. Így nem neked kell több kivitelezőt összehangolnod.',
  items: [
    {
      key: 'muanyag',
      icon: 'window' as const,
      title: 'Műanyag nyílászárók',
      body:
        'Elsősorban VEKA profilrendszerekkel készült ablakok és erkélyajtók, A osztályú profilokból. Igény esetén fa, alumínium és fa–alumínium nyílászárót is beszerzünk.',
      image: '',
      imageAlt: '[Képaláírás: műanyag ablak beépítve]',
    },
    {
      key: 'bejarati',
      icon: 'door' as const,
      title: 'Bejárati ajtók',
      body:
        'Bejárati és erkélyajtók, ahol a biztonság, a zárhatóság és a megjelenés egyszerre számít. Az ajtólap, a tok és a vasalat együtt adja a végeredményt.',
      image: '',
      imageAlt: '[Képaláírás: bejárati ajtó]',
    },
    {
      key: 'arnyekolas',
      icon: 'shutter' as const,
      title: 'Redőnyök és árnyékolástechnika',
      body:
        'Redőnyök, redőnytokos rendszerek, rolók és zsalugáterek. A nyílászáróval egy időben beépítve nem kell később külön kivitelezőt hívni.',
      image: '',
      imageAlt: '[Képaláírás: redőny]',
    },
    {
      key: 'szunyoghalo',
      icon: 'mesh' as const,
      title: 'Szúnyoghálók',
      body:
        'Ablakra és ajtóra, a nyílászáró típusához igazítva. Méretre készítve, hogy szellőztetés közben is nyugodtan nyitva lehessen hagyni a nyílászárót.',
      image: '',
      imageAlt: '[Képaláírás: szúnyogháló]',
    },
    {
      key: 'parkany',
      icon: 'sill' as const,
      title: 'Párkányok és kiegészítők',
      body:
        'Belső és külső párkányok, takarólécek és biztonsági kiegészítők — ezek zárják le tisztán a nyílászáró és a fal találkozását.',
      image: '',
      imageAlt: '[Képaláírás: külső párkány]',
    },
    {
      key: 'csere',
      icon: 'install' as const,
      title: 'Nyílászárócsere és beépítés',
      body:
        'Meglévő épületben bontással és helyreállítással, új építésnél a konszignációs terv szerint. A régi nyílászárót elszállítjuk, a munkaterületet rendezetten adjuk át.',
      image: '',
      imageAlt: '[Képaláírás: beépítés közben]',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 7. MIÉRT MINKET VÁLASSZ
 * ------------------------------------------------------------------------ */

export const why = {
  eyebrow: 'Miért minket',
  title: 'Mit kapsz tőlünk a nyílászárón kívül?',
  lead:
    'A nyílászáró önmagában termék. A teljesítményét legalább annyira eldönti a beépítés, mint a gyártó — az alábbiak erről szólnak.',
  items: [
    {
      title: 'Segítünk kiválasztani a megfelelő műszaki megoldást',
      body:
        'Végigvesszük, melyik helyiségben mi a fontos: hőszigetelés, hangszigetelés, biztonság vagy árnyékolás. Nem a legdrágábbat ajánljuk, hanem azt, aminek nálad értelme van.',
    },
    {
      title: 'Pontos helyszíni felmérést végzünk',
      body:
        'A méreteket a helyszínen vesszük fel, a falszerkezettel és a beépítés körülményeivel együtt. A felmérés díjas, de megrendelés esetén jóváírjuk, így nem jelent többletköltséget.',
    },
    {
      title: 'Mindent egy kézből intézünk',
      body:
        'Felmérés, beszerzés, kiszállítás, bontás, beépítés és helyreállítás. Nem fordulhat elő, hogy a forgalmazó és a kivitelező egymásra mutogat, ha valami nem stimmel.',
    },
    {
      title: 'A saját nyílászáródat is beépítjük',
      body:
        'Ha te szerzed be az ablakokat, mi csak a bontást és a beépítést végezzük. A kivitelezés előtt ellenőrizzük a méreteket és a beépíthetőséget.',
    },
    {
      title: 'Precíz beépítés és rendezett munkaterület',
      body:
        'A bontási törmeléket, a régi nyílászárókat és a csomagolóanyagot elszállítjuk és leadjuk a hulladékudvarban. A munkaterület tiszta állapotban kerül átadásra.',
    },
    {
      title: 'Pályázatokban is eligazítunk',
      body:
        'Tájékoztatást adunk az aktuális nyílászáró-korszerűsítési támogatásokról, és segítünk a műszaki dokumentáció összeállításában. Pályázatíró partnerekkel is kapcsolatban állunk.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 7/B. ÁRKALKULÁTOR
 *
 *  ==========================================================================
 *   ITT KELL KITÖLTENI AZ ÁRAKAT — ÉS SEHOL MÁSHOL.
 *  ==========================================================================
 *
 *  Amíg a `pricesReady` értéke `false`, a kalkulátor NEM mutat összeget:
 *  összefoglalja a választást, és ajánlatkérésre visz. Ez szándékos —
 *  kitalált ár a látogató felé ígéret, és az első telefonban lebukik.
 *
 *  Ha megvannak a valós árak:
 *   1. töltsd ki az alábbi `from` / `to` értékeket (nettó vagy bruttó,
 *      ahogy a `priceNote` mondja — de végig ugyanúgy),
 *   2. állítsd a `pricesReady` értékét `true`-ra.
 *
 *  Az összeg mindig SÁV (-tól -ig), soha nem egyetlen szám: egy nyílászáró
 *  ára a mérettől, a nyitásmódtól és a beépítés körülményeitől is függ.
 * ------------------------------------------------------------------------ */

export const calculator = {
  eyebrow: 'Árkalkulátor',
  title: 'Nézzük meg nagyságrendben, mibe kerülne',
  accent: 'nagyságrendben',
  lead:
    'Állítsd be, mire lenne szükséged, és kapsz egy tájékoztató nagyságrendet. A pontos árat a helyszíni felmérés után, tételes ajánlatban adjuk meg.',

  /** Fix ablak: a gyártói mérettáblázatból számol (src/config/pricing.ts). */
  fix: {
    legend: 'Fix ablak',
    hint: 'A gyártói mérettáblázat szerinti listaár, méret alapján.',
    widthLabel: 'Szélesség (cm)',
    heightLabel: 'Magasság (cm)',
    countLabel: 'Darabszám',
  },

  /** További nyílászárók. Ezekhez még nincs mérettáblázat. */
  others: {
    legend: 'További nyílászárók',
    items: [
      {
        key: 'openingWindow' as const,
        label: 'Nyíló / bukó-nyíló ablak',
        hint: 'Mérettáblázat alapján számolható, amint megvan',
        max: 30,
      },
      {
        key: 'balconyDoor' as const,
        label: 'Erkély- vagy teraszajtó',
        hint: 'Nagyobb üvegfelület, nyíló vagy toló',
        max: 10,
      },
      {
        key: 'entranceDoor' as const,
        label: 'Bejárati ajtó',
        hint: 'Hőszigetelt, biztonsági vasalattal',
        max: 5,
      },
    ],
  },

  /** Kiegészítők — nyílászárónként számolódnak. */
  extras: {
    legend: 'Kiegészítők',
    items: [
      { key: 'shutter' as const, label: 'Redőny' },
      { key: 'insectScreen' as const, label: 'Szúnyogháló' },
      { key: 'sill' as const, label: 'Párkányok' },
    ],
  },

  installation: {
    key: 'installation' as const,
    label: 'Beépítés bontással és helyreállítással',
    hint: 'Ha csak a nyílászárót vennéd meg, kapcsold ki.',
  },

  /** Az eredménypanel szövegei. */
  result: {
    label: 'Tájékoztató nagyságrend',
    empty: 'Állíts be legalább egy nyílászárót.',
    /** Ha a beállított tételek egyikéhez sincs még ár. */
    pending:
      'Ehhez a beállításhoz még nincs árunk feltöltve. Küldd el az ajánlatkérést, és konkrét árral keresünk meg.',
    /** Ha csak néhány tételhez hiányzik az ár. */
    missingPrefix: 'Az összeg nem tartalmazza:',
    disclaimer:
      'Ez tájékoztató nagyságrend, nem ajánlat. A végleges árat a helyszíni felmérés után, tételes ajánlatban adjuk meg.',
    cta: 'Ajánlatot kérek erre a beállításra',
  },
} as const;

/* ---------------------------------------------------------------------------
 * 8. FOLYAMAT
 * ------------------------------------------------------------------------ */

export const process = {
  eyebrow: 'A folyamat',
  title: 'Az érdeklődéstől az elkészült beépítésig',
  lead: 'Hat lépés, hogy előre tudd, mi következik. Nincs benne meglepetés.',
  steps: [
    {
      title: 'Ajánlatkérés',
      body: 'Kitöltöd az űrlapot néhány adattal. Nem kell méret vagy műszaki leírás.',
    },
    {
      title: 'Telefonos egyeztetés',
      body: 'Két munkanapon belül keresünk, és átbeszéljük az elképzeléseidet és a helyszínt.',
    },
    {
      title: 'Helyszíni felmérés',
      body: 'Pontos méretet veszünk és tanácsot adunk. A felmérés díját megrendelés esetén jóváírjuk.',
    },
    {
      title: 'Pontos ajánlat',
      body: 'Tételes, összehasonlítható ajánlatot készítünk a felmérés alapján.',
    },
    {
      title: 'Szerződés és ütemezés',
      body: 'Rögzítjük a tartalmat, a határidőt, a garanciát és a kivitelezés feltételeit.',
    },
    {
      title: 'Bontás, beépítés, helyreállítás',
      body: 'Beépítjük a nyílászárókat, elvégezzük a javításokat, és rendet hagyunk magunk után.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 9. REFERENCIÁK
 *
 *  FONTOS: ide csak valós, elvégzett munka kerülhet.
 *
 *  Két megjelenítési mód, a kitöltött mezőktől függően:
 *   - `beforeImage` + `afterImage` → előtte–utána összehasonlító csúszka
 *   - csak `afterImage`            → egyetlen kép, nagy nézettel
 *
 *  A fájlnevek előre be vannak írva: tedd a képeket a /public mappába
 *  ezekkel a nevekkel, és maguktól megjelennek. Amíg egy fájl nincs ott,
 *  jelölt képhelyőrző látszik a helyén — nem törött kép.
 * ------------------------------------------------------------------------ */

export const references = {
  eyebrow: 'Referenciák',
  title: 'Elkészült munkáink',
  lead: '[Rövid felvezető: milyen jellegű munkákat mutattok be itt.]',
  /**
   * A galéria képei. A kártyákon nincs képaláírás — csak a fotók.
   *
   * Az `alt` a képernyőolvasóknak és a keresőknek szól, az oldalon nem
   * látszik. Akkor jelenik meg, ha a kép valamiért nem töltődik be.
   */
  items: [
    { id: 'ref-1', image: 'ref-1.webp', alt: 'Frissen beépített kétszárnyú műanyag ablak kívülről, a beépítés lezárása előtt' },
    { id: 'ref-2', image: 'ref-2.webp', alt: 'Kétszárnyú műanyag ablak belülről, kilátással a kertre' },
    { id: 'ref-3', image: 'ref-3.webp', alt: 'Két beépített műanyag ablak sárga homlokzaton' },
    { id: 'ref-4', image: 'ref-4.webp', alt: 'Családi ház homlokzata négy beépített nyílászáróval' },
    { id: 'ref-5', image: 'ref-5.webp', alt: 'Kétszárnyú műanyag ablak új külső párkánnyal' },
    { id: 'ref-6', image: 'ref-6.webp', alt: 'Beépített kétszárnyú ablak külső párkánnyal, közelről' },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 10. ÜGYFÉLVÉLEMÉNYEK
 *
 *  MINTATARTALOM. Kitalált vélemény, név vagy értékelés megtévesztő és
 *  jogilag is kockázatos, ezért itt szándékosan jelölt helyőrző áll.
 *  Cseréld valós, az ügyféltől engedélyezett szövegre — vagy vedd ki a
 *  szekciót, amíg nincs ilyen.
 * ------------------------------------------------------------------------ */

export const testimonials = {
  eyebrow: 'Ügyfélvélemények',
  title: 'Mit mondanak az ügyfeleink?',
  accent: 'ügyfeleink',
  lead: 'Valós, nyilvános Google-értékelésekből.',
  /** Csak akkor jelenik meg, ha a vélemények még helyőrzők. */
  sampleNotice:
    'Mintatartalom — cseréld valós, az ügyféltől engedélyezett véleményre, mielőtt élesíted az oldalt.',
  items: [
    {
      id: 'tes-1',
      quote:
        'Egyedülállóan korrekt, tisztességes és jó szakember. Részletes árajánlatot kaptam, gyors és pontos munkát. Az építési területet tisztán, rendben kaptam vissza. Csak ajánlani tudom mindenkinek.',
      author: 'Viktor Goldschmidt',
      meta: 'Google-értékelés',
    },
    {
      id: 'tes-2',
      quote:
        'Köszönjük a gyors, szakszerű munkát. Maximálisan elégedettek vagyunk az ügyintézéssel és a kivitelezéssel.',
      author: 'Edit Gazdáné Ott',
      meta: 'Google-értékelés',
    },
    {
      id: 'tes-3',
      quote:
        'Megbízható, pontos kivitelező, ajánlani tudom mindenkinek. Amiben megegyeztünk, azt maradéktalanul teljesítette. További munkákat is rá fogok bízni.',
      author: 'Endre Peter',
      meta: 'Google-értékelés',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 11. GYAKORI KÉRDÉSEK
 *
 *  Az árat, a határidőt és a garanciát érintő részek szándékosan
 *  helyőrzők. Kitalált szám itt nem csak félrevezető: ígéretnek számít.
 * ------------------------------------------------------------------------ */

export const faq = {
  eyebrow: 'Gyakori kérdések',
  title: 'Amit a leggyakrabban kérdeznek tőlünk',
  lead: 'Ha valamire nem találsz itt választ, kérdezd meg az ajánlatkérő űrlapon.',
  items: [
    {
      q: 'Mennyibe kerül egy nyílászárócsere?',
      a: 'Az ár a mérettől, a nyílászáró típusától, az üvegezéstől, a vasalattól és a beépítés körülményeitől függ, ezért felmérés nélkül csak félrevezető szám adható. A felmérés után tételes ajánlatot kapsz, amiben látod az egyes tételek árát, és azt is, mi nincs benne.',
    },
    {
      q: 'Mennyi idő alatt készül el a kivitelezés?',
      a: 'A helyszíni munka rövidebb, mint amire a legtöbben számítanak: egy átlagos ablak vagy ajtó cseréje általában 1–3 óra. A teljes átfutást a nyílászárók gyártási ideje határozza meg, ezt az ajánlatban rögzítjük. A pontos ütemezést a helyszíni felmérés után tudjuk megadni.',
    },
    {
      q: 'Szükséges helyszíni felmérés?',
      a: 'Pontos méretek nélkül nem lehet rendelni. A méretvételt útmutatásunk alapján magad is elvégezheted — ilyenkor az adatok pontosságáért te felelsz —, vagy kérheted a helyszíni felmérésünket szakmai tanácsadással. Ez utóbbi díjas, de megrendelés esetén a díját jóváírjuk, így nem jelent többletköltséget.',
    },
    {
      q: 'Két- vagy háromrétegű üvegezést érdemes választani?',
      a: 'Nincs egy jó válasz mindenre. A háromrétegű üvegezés jobb hőszigetelést ad, de nehezebb és drágább, és nem minden helyzetben térül meg — egy kevéssé fűtött vagy északi tájolású helyiségnél másképp éri meg, mint egy nagy üvegfelületű nappaliban. A felmérésen helyiségenként átbeszéljük, hol melyiknek van értelme.',
    },
    {
      q: 'A régi nyílászárók bontását is vállaljátok?',
      a: 'Igen. A bontást úgy végezzük, hogy a környező falazat, vakolat és burkolat a lehető legkevésbé sérüljön, majd elvégezzük a szükséges javításokat és a helyreállítást. A régi nyílászárókat és a bontási törmeléket elszállítjuk és leadjuk a hulladékudvarban. Hogy pontosan mi tartozik bele, azt tételesen az ajánlat rögzíti.',
    },
    {
      q: 'Redőny és szúnyogháló is kérhető?',
      a: 'Igen, az árnyékolás és a szúnyogháló ugyanannak a megrendelésnek a része lehet — redőny, redőnytok, roló, zsalugáter vagy szúnyogháló. Érdemes együtt tervezni a nyílászáróval, mert így a méretek és a beépítés összehangolhatók, és nem kell később külön kivitelezőt hívni.',
    },
    {
      q: 'Milyen garancia vonatkozik a munkára?',
      a: 'Két dolgot érdemes külön nézni. A beépítésre kivitelezési garanciát vállalunk, amelynek részleteit a szerződésben rögzítjük, a beépített nyílászárók típusához és a kivitelezés jellegéhez igazítva. Magukra a nyílászárókra a gyártó termékgaranciája vonatkozik. A jogszabályi szavatossági jogaid ettől függetlenül megilletnek.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 12. AJÁNLATKÉRŐ SZEKCIÓ ÉS ŰRLAP
 * ------------------------------------------------------------------------ */

/**
 * Az ajánlatkérő kérdőív.
 *
 * Négy gyors, egyérintéses kérdés minősíti a megkeresést, és csak utána
 * kéri az elérhetőséget. Így a hívás előtt tudod, mekkora a munka, mire
 * van szükség, mennyire sürgős és hol van az ingatlan — a „még csak
 * tájékozódom" válasz pedig elkülöníthető a valódi, élő érdeklődéstől.
 *
 * A kérdések sorrendje és az opciók szövege itt szerkeszthető. A `key`
 * értékeket ne írd át: azokra hivatkozik a kód és a mérés.
 */
export const form = {
  eyebrow: 'Ajánlatkérés',
  /**
   * A hero alatti, rövid ajánlatkérő fejléce. Ugyanaz a kérdőív fut benne,
   * mint a lap alján — csak a felvezetés rövidebb, mert itt a látogató még
   * nem olvasott végig semmit.
   */
  top: {
    eyebrow: 'Kezdjük itt',
    title: 'Kérj ajánlatot két percben',
    lead:
      'Négy gyors kérdés, aztán az elérhetőséged. Nem kell méret vagy műszaki leírás — a részleteket a felmérésen tisztázzuk.',
    points: [
      'Két munkanapon belül visszahívunk',
      'A felmérés díját megrendelés esetén jóváírjuk',
      'Tételes, összehasonlítható ajánlat',
    ],
  },
  title: 'Szeretnéd megtudni, milyen megoldás illik az otthonodhoz?',
  lead:
    'Négy gyors kérdés, aztán az elérhetőséged. Két munkanapon belül felvesszük veled a kapcsolatot.',
  /** A négy minősítő kérdés. Mindegyik egy lépés, egy kattintással. */
  questions: [
    {
      key: 'propertyType' as const,
      title: 'Milyen ingatlanról van szó?',
      hint: 'Ebből tudjuk, milyen beépítési körülményekre számítsunk.',
      options: ['Családi ház', 'Társasházi lakás', 'Egyéb (iroda, üzlet, nyaraló)'],
    },
    {
      key: 'windowCount' as const,
      title: 'Hány nyílászárót érint a csere?',
      hint: 'Elég egy becslés — a pontos darabszám a felmérésen derül ki.',
      options: ['1–3 db', '4–8 db', '8 db felett'],
    },
    {
      key: 'needs' as const,
      title: 'Mire van szükséged?',
      hint: 'Így rögtön a megfelelő megoldással tudunk hívni.',
      options: ['Csak ablakra', 'Ablakra és redőnyre', 'Ablakra, redőnyre és szúnyoghálóra'],
    },
    {
      key: 'timing' as const,
      title: 'Mikor tervezed a nyílászárócserét?',
      hint: 'Nem baj, ha még csak tájékozódsz — ezt is jelöld nyugodtan.',
      options: ['Most azonnal', '1–3 hónapon belül', 'Még csak tájékozódom'],
    },
  ],
  /** Az utolsó lépés fejléce. */
  contactStep: {
    title: 'Hova küldhetjük a választ?',
    hint: 'A telefonszám kell a visszahíváshoz, a település pedig ahhoz, hogy lássuk, a területünkön van-e az ingatlan.',
  },
  /** „Mi történik a beküldés után” — az űrlap mellett jelenik meg. */
  afterSubmit: [
    'Megnézzük a válaszaidat, és összeállítjuk a kérdéseinket.',
    'Két munkanapon belül felhívunk a megadott telefonszámon.',
    'Időpontot egyeztetünk a helyszíni felmérésre.',
    'A felmérés után elkészítjük a tételes ajánlatot.',
  ],
  /** A köszönőüzenet szövege sikeres beküldés után. */
  thankYou: {
    title: 'Köszönjük, megkaptuk a kérésed!',
    lead: 'Két munkanapon belül felvesszük veled a kapcsolatot a megadott telefonszámon.',
    points: [
      'A megkeresésedet rögzítettük, nem vész el.',
      'Ha sürgős, hívj minket nyugodtan közvetlenül is.',
    ],
  },
  /**
   * Opcionális külön köszönőoldal. Ha megadsz egy útvonalat (pl.
   * '/koszonjuk'), sikeres beküldés után az oldal oda navigál — hasznos,
   * ha a GA4-ben oldalletöltés-alapú konverziót mérsz.
   */
  thankYouUrl: '',
} as const;

/* ---------------------------------------------------------------------------
 * 13. FOOTER ÉS JOGI SZÖVEGEK
 * ------------------------------------------------------------------------ */

export const legal = {
  privacy: {
    title: 'Adatkezelési tájékoztató',
    /** Ha külön aloldalon van, add meg az URL-t — akkor linkként viselkedik. */
    href: '',
    body: '[Ide kerül a teljes adatkezelési tájékoztató — a meglévő agostongeneral.hu tájékoztató szövege átemelhető. Tartalmaznia kell: az adatkezelő nevét és elérhetőségét, a kezelt adatok körét, az adatkezelés célját és jogalapját, a megőrzési időt, az adatfeldolgozókat és az érintett jogait.]',
  },
  imprint: {
    title: 'Impresszum',
    href: '',
    body: 'Ágoston-Generál Kft. · Székhely: 8648 Balatonkeresztúr, Iskola utca 4/I · Képviselő: Ágoston Zsolt ügyvezető · Cégjegyzékszám: 14-09-321548 · Adószám: 32793246-2-14 · E-mail: agostongeneral@gmail.com · Telefon: +36 70 547 9595 · Tárhelyszolgáltató: [TÁRHELYSZOLGÁLTATÓ NEVE ÉS ELÉRHETŐSÉGE]',
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
