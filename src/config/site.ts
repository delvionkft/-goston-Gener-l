/**
 * ============================================================================
 *  EGYETLEN SZERKESZTENDŐ FÁJL A TARTALOMHOZ
 * ============================================================================
 *
 *  Az oldal minden cégspecifikus adata és szövege itt van. A komponensek
 *  semmilyen üzleti adatot nem tartalmaznak hardcode-olva.
 *
 *  HOGYAN VEDD HASZNÁLATBA:
 *  1. Cseréld ki a szögletes zárójeles értékeket (`[CÉGNÉV]`) valós adatra.
 *  2. Amíg egy érték helyőrző, az oldalon megjelölve jelenik meg —
 *     fejlesztői módban sárga háttérrel —, így nem lehet véletlenül
 *     kitöltetlenül élesíteni.
 *  3. A `npm run check:content` kilistázza az összes maradék helyőrzőt,
 *     és hibával kilép, ha maradt ilyen.
 *
 *  AMIT SOHA NE TEGYÉL IDE:
 *  kitalált referenciát, ügyfélvéleményt, kedvezményt, garanciát,
 *  tanúsítványt vagy számszerű eredményt. Ami nincs meg, maradjon helyőrző.
 *
 *  AMIT VISZONT ELLENŐRIZZ:
 *  a szolgáltatások és a munkafolyamat lépései `enabled` kapcsolóval
 *  ki-be kapcsolhatók. Csak azt hagyd bekapcsolva, amit a cég tényleg
 *  vállal. Egy nem vállalt szolgáltatás ugyanolyan félrevezető, mint egy
 *  kitalált referencia.
 * ============================================================================
 */

/** Igaz, ha az érték még kitöltetlen helyőrző. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === 'string' && /^\[.+\]$/.test(value.trim());
}

/** Igaz, ha a mező valós, megjeleníthető értéket tartalmaz. */
export function isFilled(value: string | undefined | null): value is string {
  return typeof value === 'string' && value.trim().length > 0 && !isPlaceholder(value);
}

/* ===========================================================================
 * 1. ALAPADATOK — ezeket cseréld ki először
 * ======================================================================== */

export const company = {
  /** Cég teljes neve, ahogy a fejlécben és a footerben megjelenik. */
  name: 'Ágoston-Generál',
  /** Rövid név / logószöveg. A footer háttérfelirata is ebből készül. */
  shortName: 'Ágoston-Generál',
  /** Cégjegyzékbe bejegyzett név, ha eltér. Üresen hagyható. */
  legalName: '',
  /**
   * Logó a /public mappából, pl. '/logo.svg'. SVG vagy átlátszó hátterű PNG.
   * Üresen hagyva a fejlécben egy egyszerű márkajel, a footerben pedig a
   * cégnév szöveges változata jelenik meg — nincs törött képikon.
   */
  logo: '',
  /** A logó alt szövege. Csak akkor számít, ha van logó. */
  logoAlt: '',
  /** Szolgáltatási terület, pl. „Budapest és Pest vármegye”. */
  serviceArea: '[TELEPÜLÉSEK VAGY RÉGIÓ]',
  /**
   * Hány éve dolgozik a cég a szakmában. Csak számot írj ide (pl. '12').
   * Amíg helyőrző, a tapasztalatra hivatkozó elemek nem jelennek meg —
   * kitalált évszám tilos.
   */
  experienceYears: '[ÉVEK SZÁMA]',
  /** Adószám. Üresen hagyható, ha nem kell megjeleníteni. */
  taxNumber: '[ADÓSZÁM]',
  /** Székhely vagy telephely. Üresen hagyható. */
  seat: '[SZÉKHELY]',
} as const;

export const contact = {
  /** Megjelenített telefonszám, pl. '+36 30 123 4567'. */
  phoneDisplay: '[TELEFONSZÁM]',
  /**
   * Tárcsázható formátum a `tel:` linkhez, szóköz nélkül: '+36301234567'.
   * Amíg helyőrző, a hívásgombok szövegként jelennek meg link helyett —
   * így nincs az oldalon működésképtelen gomb.
   */
  phoneHref: '[TELEFONSZÁM]',
  email: '[E-MAIL-CÍM]',
  /** Telephely címe a footerhez. Üres = nem jelenik meg. */
  address: '',
  /**
   * Elérhetőségi idő, pl. 'Hétfő–péntek 8:00–17:00'.
   * Üres = a nyitvatartás blokk nem jelenik meg sehol.
   */
  hours: '',
  /**
   * Válaszadási idő az űrlap mellett, pl. '1 munkanapon belül'.
   * CSAK akkor töltsd ki, ha ezt tényleg tartani tudod. Üres = nem
   * jelenik meg. Be nem tartott ígéret rosszabb, mint a semmilyen.
   */
  responseTime: '',
} as const;

/**
 * Közösségi média. Csak azokat hagyd benne, amelyek tényleg léteznek —
 * a többi sort töröld. Üres tömb esetén a blokk nem jelenik meg.
 */
export const socialLinks: readonly { label: string; href: string }[] = [
  { label: 'Facebook', href: '' },
  { label: 'Instagram', href: '' },
];

export const site = {
  /** Éles URL. A canonical linkhez és az Open Graph adatokhoz kell. */
  url: 'https://example.hu',
  locale: 'hu_HU',
  /** OG kép a /public mappában. Ajánlott: 1200×630 px. */
  ogImage: '/og-image.png',
  /**
   * Böngészőfül címe és Open Graph cím. Szerkeszthető.
   * A `{ceg}` helyére a cégnév kerül.
   */
  title: '{ceg} — nyílászáró csere, beépítés és árnyékolástechnika',
  /** Meta description. 150–160 karakter az ideális. */
  description:
    'Új nyílászárók felméréstől a beépítésig. Műanyag, fa és alumínium ablakok, bejárati ajtók, redőny és szúnyogháló. Kérj személyre szabott ajánlatot.',
} as const;

/* ===========================================================================
 * 2. NAVIGÁCIÓ ÉS HORGONYOK
 * ======================================================================== */

export const ANCHOR = {
  hero: 'fooldal',
  quickForm: 'ajanlatkeres',
  problem: 'problemak',
  solution: 'szolgaltatasok',
  references: 'referenciak',
  process: 'folyamat',
  finalForm: 'kapcsolat',
} as const;

export const navLinks = [
  { id: ANCHOR.solution, label: 'Szolgáltatások' },
  { id: ANCHOR.references, label: 'Referenciák' },
  { id: ANCHOR.process, label: 'Folyamat' },
  { id: ANCHOR.finalForm, label: 'Kapcsolat' },
] as const;

/* ===========================================================================
 * 3. HERO
 * ======================================================================== */

export const hero = {
  /** A cím fölötti apró felirat. A szolgáltatási területet mutatja. */
  eyebrow: company.serviceArea,
  /** Az oldal egyetlen H1 címsora. A `highlight` rész kap kiemelést. */
  titleBefore: 'Új nyílászárók, ',
  titleHighlight: 'kompromisszumok',
  titleAfter: ' nélkül',
  lead: 'A felméréstől a beépítésig végigkísérünk, hogy otthonod kényelmesebb, csendesebb és energiahatékonyabb legyen.',
  primaryCta: 'Ajánlatot kérek',
  secondaryCta: 'Telefonálok',
  /**
   * Négy rövid bizalmi állítás.
   * ELLENŐRIZD: mind a négynek igaznak kell lennie a cégre. Ami nem az,
   * azt írd át vagy töröld. Nincs benne szám, garancia és tanúsítvány —
   * szándékosan, mert azt csak valós adattal szabad állítani.
   */
  points: [
    {
      title: 'Személyre szabott megoldások',
      text: 'A nyílászárót az adott nyíláshoz és a te igényeidhez választjuk ki.',
    },
    {
      title: 'Szakszerű helyszíni felmérés',
      text: 'Pontos méretek és a beépítés körülményei a helyszínen rögzülnek.',
    },
    {
      title: 'Precíz beépítés',
      text: 'A beépítést mi végezzük, nem alvállalkozói láncon keresztül.',
    },
    {
      title: 'Átlátható munkafolyamat',
      text: 'Tudod, mi a következő lépés, és mikor várható.',
    },
  ],
  /**
   * Hero kép. Tedd a fájlt a /public mappába, és írd ide az útvonalát
   * (pl. '/hero.webp'). Ajánlott: 1200×1500 px, WebP vagy AVIF, 200 kB alatt.
   */
  image: '',
  imageAlt: '[Képaláírás: pl. „Beépített háromszárnyú műanyag ablak nappaliban”]',
  /**
   * Információs pontok a képen. A kép fölött kattintható jelölésként
   * jelennek meg. `x` és `y` a kép szélességének/magasságának százaléka.
   * Ha nem akarod használni őket, ürítsd ki a tömböt.
   */
  hotspots: [
    { x: 26, y: 30, title: 'Üvegezés', text: 'Két- vagy háromrétegű üveg, az adott helyiség igénye szerint.' },
    { x: 63, y: 52, title: 'Profil és vasalat', text: 'A profil kamraszáma és a vasalat a zárásért és a tartósságért felel.' },
    { x: 40, y: 78, title: 'Beépítés és párkány', text: 'A csatlakozás tömítése dönti el, marad-e huzat a kész ablaknál.' },
  ],
} as const;

/* ===========================================================================
 * 4. AJÁNLATKÉRŐ ŰRLAP
 * ======================================================================== */

export const form = {
  quick: {
    title: 'Kérj személyre szabott ajánlatot!',
    lead: 'Add meg az elérhetőségeidet és néhány alapvető információt a tervezett munkáról. Felvesszük veled a kapcsolatot a részletek egyeztetéséhez.',
  },
  final: {
    title: 'Tervezed a nyílászárók cseréjét?',
    lead: 'Kérj személyre szabott ajánlatot, és egyeztessünk az otthonodhoz, igényeidhez és lehetőségeidhez illő megoldásról.',
    cta: 'Elindítom az ajánlatkérést',
  },
  /** A „mi történik a beküldés után” blokk pontjai az űrlap mellett. */
  afterSubmit: [
    'Átnézzük, amit írtál, és tisztázzuk a nyitott kérdéseket.',
    'Felvesszük veled a kapcsolatot a megadott elérhetőségen.',
    'Egyeztetünk egy időpontot a helyszíni felmérésre.',
  ],
  /**
   * A „Milyen munkára van szükséged?” mező opciói.
   * Alapból a bekapcsolt szolgáltatásokból áll össze (lásd lentebb),
   * így nem kell két helyen karbantartani.
   */
  otherOption: 'Egyéb / még nem tudom',
} as const;

/* ===========================================================================
 * 5. PROBLÉMAFELVETÉS
 *
 *  Ezek tünetek, nem diagnózisok. A szövegek szándékosan nem állítanak
 *  biztos okot — azt csak helyszíni felméréssel lehet megállapítani.
 * ======================================================================== */

export const problem = {
  eyebrow: 'Ismerős helyzetek',
  title: 'Ismerősek ezek a problémák?',
  lead: 'A legtöbb nyílászárócsere egy hétköznapi bosszúsággal kezdődik. Kattints arra, ami nálad a legismerősebb — leírjuk, mit szoktunk ilyenkor megnézni.',
  /**
   * A jelölés helye az ablakillusztráción, a doboz szélességének és
   * magasságának százalékában.
   */
  items: [
    {
      key: 'huzat',
      label: 'Huzat a zárt ablaknál',
      short: 'Huzat',
      title: 'Huzatot érzel, pedig az ablak zárva van',
      body: 'Ha zárt szárny mellett is érezhető a légmozgás, az jöhet a tömítésből, a vasalat állításából vagy a fal és a tok csatlakozásából. Melyik, az kívülről nem látszik — ezt a helyszínen nézzük meg.',
      hotspot: { x: 12, y: 46 },
    },
    {
      key: 'ho',
      label: 'Télen hideg, nyáron forró',
      short: 'Hőérzet',
      title: 'A helyiség télen hideg, nyáron gyorsan felmelegszik',
      body: 'A hőérzetet az üvegezés, a profil és a beépítés együtt határozza meg — és a tájolás is számít. Felméréskor azt is megnézzük, hol éri meg árnyékolással kiegészíteni.',
      hotspot: { x: 29, y: 33 },
    },
    {
      key: 'parasodas',
      label: 'Párásodik az üveg',
      short: 'Párásodás',
      title: 'Rendszeresen párásodik az üveg',
      body: 'Nem mindegy, hogy az üveg belső oldalán vagy a rétegek között csapódik ki a pára — más okot és más megoldást jelent. A szellőztetési szokások is beleszólnak, ezért ezt mindig együtt nézzük át.',
      hotspot: { x: 71, y: 64 },
    },
    {
      key: 'nyitas',
      label: 'Nehezen nyílik vagy záródik',
      short: 'Nyitás',
      title: 'Nehezen nyílik vagy záródik az ablak',
      body: 'Néha elég a vasalat beállítása vagy egy kopott alkatrész cseréje, néha a szárny vagy a tok vetemedett meg. Megnézzük, hogy javítás vagy csere az ésszerűbb.',
      hotspot: { x: 55, y: 50 },
    },
    {
      key: 'zaj',
      label: 'Behallatszik az utcai zaj',
      short: 'Zaj',
      title: 'Erősen behallatszik az utcai zaj',
      body: 'A hanggátlásban az üvegszerkezet és a zárás minősége a meghatározó. Megnézzük, honnan jön a zaj, és milyen üvegezéssel lehet érdemben csökkenteni.',
      hotspot: { x: 75, y: 26 },
    },
    {
      key: 'zaras',
      label: 'Nem zár megfelelően',
      short: 'Zárás',
      title: 'A régi szerkezet már nem zár rendesen',
      body: 'Évek alatt a tömítés benyomódik, a vasalat kilazul, a fa dolgozik. Megnézzük, hogy a meglévő szerkezet felújítható-e, vagy a csere a hosszabb távon jobb megoldás.',
      hotspot: { x: 50, y: 12 },
    },
    {
      key: 'beazas',
      label: 'Sérülés vagy beázás',
      short: 'Beázás',
      title: 'Az ablak körül sérülés vagy beázás látszik',
      body: 'Ez lehet a párkány, a bádogozás vagy a tok körüli tömítés hibája, de lehet a falszerkezeté is. Mielőtt bármit javasolunk, megnézzük, honnan jön a nedvesség.',
      hotspot: { x: 30, y: 82 },
    },
  ],
  /** A szekció alatti figyelmeztetés — szándékosan hangsúlyos. */
  disclaimer:
    'Ezek tünetek, nem diagnózisok. A pontos okot — és azt, hogy javítás vagy csere az ésszerűbb — helyszíni felméréssel lehet meghatározni.',
  cta: 'Szeretném felméretni',
} as const;

/* ===========================================================================
 * 6. SZOLGÁLTATÁSOK
 *
 *  `enabled: false` → a szolgáltatás sehol nem jelenik meg, és az űrlap
 *  választólistájából is kimarad. Csak azt hagyd bekapcsolva, amit a cég
 *  tényleg vállal.
 *
 *  Az `options` mezők döntési szempontok, nem készletlista. Ha valamelyik
 *  lehetőséget nem tudod biztosítani, töröld a sort.
 * ======================================================================== */

export interface Service {
  key: string;
  /** Megjelenik a kártyán, a szűrőben és az űrlap választólistájában. */
  label: string;
  enabled: boolean;
  /** Egy mondat: mit takar. */
  summary: string;
  /** Kinek ajánlott. */
  audience: string;
  /** Milyen problémára adhat megoldást. */
  solves: string;
  /** Miből választhat az érdeklődő. */
  options: readonly string[];
  image: string;
  imageAlt: string;
}

export const services: readonly Service[] = [
  {
    key: 'muanyag',
    label: 'Műanyag nyílászárók',
    enabled: true,
    summary: 'A leggyakrabban választott megoldás lakóépületek ablakcseréjéhez.',
    audience: 'Ha jó ár-érték arányt keresel, és nem akarsz évente festeni, karbantartani.',
    solves: 'Huzat, rossz zárás, gyenge hő- és hangszigetelés a régi szerkezeteknél.',
    options: [
      'Profil: eltérő kamraszámú változatok',
      'Üvegezés: két- vagy háromrétegű',
      'Szín: fehér vagy fóliázott, fa- és egyéb dekorokkal',
      'Nyitásmód: bukó-nyíló, tolóajtó, fix mező',
    ],
    image: '',
    imageAlt: '[Képaláírás: műanyag nyílászáró]',
  },
  {
    key: 'fa',
    label: 'Fa nyílászárók',
    enabled: true,
    summary: 'Természetes anyag, ahol a megjelenés is szempont.',
    audience: 'Régi vagy védett épületekhez, illetve ha a fa látványához ragaszkodsz.',
    solves: 'Elöregedett fa ablakok cseréje az eredeti karakter megtartásával.',
    options: [
      'Alapanyag: boróka, fenyő vagy keményfa rétegelt szerkezet',
      'Felületkezelés: lazúr vagy fedőfestés',
      'Üvegezés: két- vagy háromrétegű',
      'Osztás: valódi vagy felragasztott osztóléc',
    ],
    image: '',
    imageAlt: '[Képaláírás: fa nyílászáró]',
  },
  {
    key: 'alu',
    label: 'Alumínium nyílászárók',
    enabled: true,
    summary: 'Nagy méretű, karcsú szerkezetekhez és erősebb igénybevételhez.',
    audience: 'Nagy üvegfelület, emelt-toló ajtó vagy üzlethelyiség esetén.',
    solves: 'Nagy nyílásméret, ahol a műanyag profil már túl vastag vagy nem elég erős.',
    options: [
      'Hőhídmentes vagy hőhidas szerkezet',
      'Színválasztás RAL-skála szerint',
      'Nagy méretű emelt-toló és harmonika megoldások',
      'Vékony látszó keret a nagyobb üvegfelületért',
    ],
    image: '',
    imageAlt: '[Képaláírás: alumínium nyílászáró]',
  },
  {
    key: 'bejarati',
    label: 'Bejárati ajtók',
    enabled: true,
    summary: 'A ház első benyomása — és egyben a legfontosabb zárási pont.',
    audience: 'Ha a régi ajtó huzatos, nehezen zár, vagy már nem érzed biztonságosnak.',
    solves: 'Huzat, gyenge zárás, elavult zárszerkezet, nem megfelelő hőszigetelés.',
    options: [
      'Anyag: műanyag, fa vagy alumínium',
      'Panelezett vagy üvegezett kivitel',
      'Zárszerkezet: többpontos záródás',
      'Kilincs, küszöb és kiegészítők',
    ],
    image: '',
    imageAlt: '[Képaláírás: bejárati ajtó]',
  },
  {
    key: 'redony',
    label: 'Redőnyök és árnyékolástechnika',
    enabled: true,
    summary: 'Nyári hővédelem, sötétítés és plusz zárás egyben.',
    audience: 'Ha nyáron felmelegszik a helyiség, vagy sötétítésre van szükséged.',
    solves: 'Nyári túlmelegedés, erős betűzés, hálószoba sötétítése.',
    options: [
      'Redőny: műanyag vagy alumínium lamella',
      'Beépítés: tokos vagy utólag felszerelhető',
      'Működtetés: gurtni, kézi hajtókar vagy motoros',
      'Egyéb árnyékolás: reluxa, szalagfüggöny, napellenző',
    ],
    image: '',
    imageAlt: '[Képaláírás: redőny vagy árnyékoló]',
  },
  {
    key: 'szunyoghalo',
    label: 'Szúnyoghálók',
    enabled: true,
    summary: 'Nyitott ablak rovarok nélkül.',
    audience: 'Ha nyáron szellőztetnél, de nem akarsz rovarokat beengedni.',
    solves: 'Szellőztetés rovarok nélkül, akár erkélyajtónál is.',
    options: [
      'Fix kerethálók ablakokra',
      'Nyíló háló erkély- és bejárati ajtóhoz',
      'Rolós vagy pliszé háló',
      'Háziállat-biztos, erősített hálószövet',
    ],
    image: '',
    imageAlt: '[Képaláírás: szúnyogháló]',
  },
  {
    key: 'parkany',
    label: 'Párkányok',
    enabled: true,
    summary: 'A nyílászáró befejező eleme kívül és belül.',
    audience: 'Nyílászárócseréhez, illetve ha a meglévő párkány sérült vagy beázik.',
    solves: 'Beázás, sérült külső párkány, hiányzó vagy nem illeszkedő belső párkány.',
    options: [
      'Külső: alumínium vagy horganyzott lemez',
      'Belső: műanyag vagy műkő',
      'Színválasztás a nyílászáróhoz igazítva',
      'Mérethelyes, helyszínen igazított kivitel',
    ],
    image: '',
    imageAlt: '[Képaláírás: párkány]',
  },
  {
    key: 'csere',
    label: 'Nyílászárócsere és beépítés',
    enabled: true,
    summary: 'A régi szerkezet kibontása és az új szakszerű beépítése.',
    audience: 'Ha nem csak a nyílászárót vennéd meg, hanem a beépítést is ránk bíznád.',
    solves: 'A nyílászáró minősége önmagában kevés — a beépítés dönti el az eredményt.',
    options: [
      'Régi szerkezet kibontása és elszállítása',
      'Tokrögzítés és a csatlakozás tömítése',
      'Vasalat beállítása, működés ellenőrzése átadáskor',
      'Párkány és külső bádogozás igazítása',
    ],
    image: '',
    imageAlt: '[Képaláírás: nyílászáró beépítése]',
  },
  {
    key: 'helyreallitas',
    label: 'Bontás utáni helyreállítás',
    /**
     * ELLENŐRIZD: csak akkor hagyd bekapcsolva, ha a cég ezt tényleg vállalja.
     * Ha nem, állítsd `false`-ra — így sehol nem jelenik meg.
     */
    enabled: true,
    summary: 'A beépítés után a nyílás széle visszakapja a kész felületet.',
    audience: 'Ha nem akarsz külön mesterembert keresni a bontás utáni munkára.',
    solves: 'A csere után maradó sérült vakolat, festetlen káva, hiányzó lezárás.',
    options: [
      'Káva javítása és glettelése',
      'Festés a meglévő felülethez igazítva',
      'Külső oldal lezárása',
      'Takarítás és a törmelék elszállítása',
    ],
    image: '',
    imageAlt: '[Képaláírás: helyreállítás beépítés után]',
  },
  {
    key: 'javitas',
    label: 'Javítás és szerviz',
    /** ELLENŐRIZD: csak akkor `true`, ha a cég vállal javítási munkákat. */
    enabled: true,
    summary: 'Ha a meglévő szerkezet még megmenthető.',
    audience: 'Ha nem akarsz azonnal cserélni, és előbb a javítási lehetőséget néznéd.',
    solves: 'Rosszul záró szárny, kopott tömítés, elromlott vasalat vagy zár.',
    options: [
      'Vasalat beállítása',
      'Tömítés cseréje',
      'Zárszerkezet és kilincs cseréje',
      'Üvegcsere törött üveg esetén',
    ],
    image: '',
    imageAlt: '[Képaláírás: nyílászáró javítása]',
  },
];

export const solution = {
  eyebrow: 'Szolgáltatások',
  title: 'Minden szükséges megoldás egy helyen',
  lead: 'A megfelelő nyílászáró kiválasztásától a beépítés befejezéséig egy helyen intézhető. Nem kell külön kereskedőt, beépítőt és árnyékolós szakembert keresned.',
  ctaText:
    'Nem kell előre tudnod, pontosan milyen nyílászáróra van szükséged. Mondd el, mit szeretnél megoldani, és segítünk megtalálni a megfelelő lehetőséget.',
  cta: 'Szakértői segítséget kérek',
} as const;

/** Csak a bekapcsolt szolgáltatások. Ezt használja az egész oldal. */
export const activeServices = services.filter((service) => service.enabled);

/* ===========================================================================
 * 7. REFERENCIÁK
 *
 *  IDE CSAK VALÓS, ELVÉGZETT MUNKA KERÜLHET. Amíg nincs referenciaanyag,
 *  hagyd a helyőrzőket — kitalált projekt megtévesztő és jogilag is kockázatos.
 *
 *  A `category` értéke egy szolgáltatás `key`-e (lásd fentebb) — ebből
 *  épül fel a szűrő automatikusan.
 * ======================================================================== */

export interface ReferenceItem {
  id: string;
  title: string;
  /** Melyik szolgáltatáshoz tartozik. A szűrő ez alapján működik. */
  category: string;
  location: string;
  /** Milyen munka készült el. */
  work: string;
  /** Milyen megoldás került beépítésre. */
  installed: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Előtte-utána képpár. Mindkettő megadva → összehasonlító csúszka. */
  beforeImage: string;
  beforeAlt: string;
  afterImage: string;
  afterAlt: string;
}

function emptyReference(index: number, category: string): ReferenceItem {
  return {
    id: `ref-${index}`,
    title: '[PROJEKT CÍME]',
    category,
    location: '[HELYSZÍN]',
    work: '[ELVÉGZETT MUNKA TÍPUSA]',
    installed: '[BEÉPÍTETT MEGOLDÁS]',
    description: '[Rövid projektleírás: mi volt a feladat és mi készült el.]',
    image: '',
    imageAlt: '[REFERENCIAKÉP leírása]',
    beforeImage: '',
    beforeAlt: '[ELŐTTE kép leírása]',
    afterImage: '',
    afterAlt: '[UTÁNA kép leírása]',
  };
}

export const references = {
  eyebrow: 'Munkáink',
  title: 'Korábbi munkáink',
  lead: 'Nézd meg, milyen nyílászáró-beépítéseket és felújításokat valósítottunk meg.',
  /** Hány elem látszik egy „oldalon”, mielőtt a Továbbiak gomb megjelenik. */
  pageSize: 6,
  /**
   * Helyőrző elemek. Cseréld valós projektekre: töltsd ki a mezőket, és
   * add meg a képek útvonalát. A `category` a szűrőhöz kell.
   */
  items: [
    emptyReference(1, 'muanyag'),
    emptyReference(2, 'muanyag'),
    emptyReference(3, 'bejarati'),
    emptyReference(4, 'fa'),
    emptyReference(5, 'redony'),
    emptyReference(6, 'csere'),
    emptyReference(7, 'alu'),
    emptyReference(8, 'parkany'),
  ] as readonly ReferenceItem[],
} as const;

/**
 * Ügyfélvélemények.
 *
 * SZÁNDÉKOSAN ÜRES. Ne találj ki neveket és véleményeket. Ha van valós,
 * hozzájárulással megosztható visszajelzésed, vedd fel ide — a blokk
 * automatikusan megjelenik. Amíg üres, nem jelenik meg semmi.
 */
export const testimonials: readonly { name: string; location: string; text: string }[] = [];

/* ===========================================================================
 * 8. MUNKAFOLYAMAT
 *
 *  `enabled: false` → a lépés nem jelenik meg. Csak azt hagyd bent, ami
 *  a cég tényleges folyamatának megfelel. A számozás automatikus.
 * ======================================================================== */

export const process = {
  eyebrow: 'Folyamat',
  title: 'Így zajlik a közös munka',
  lead: 'Az első megkereséstől a kész, beépített nyílászáróig. Minden lépésnél tudod, hol tartunk, és mi következik.',
  steps: [
    {
      key: 'ajanlatkeres',
      enabled: true,
      title: 'Ajánlatkérés',
      body: 'Kitöltöd az űrlapot, vagy telefonon felveszed velünk a kapcsolatot.',
    },
    {
      key: 'egyeztetes',
      enabled: true,
      title: 'Egyeztetés',
      body: 'Megismerjük az igényeidet, és bekérjük a szükséges alapinformációkat.',
    },
    {
      key: 'tajekoztatas',
      enabled: true,
      title: 'Előzetes tájékoztatás',
      body: 'Az elérhető információk alapján megtörténik az első szakmai egyeztetés.',
    },
    {
      key: 'felmeres',
      enabled: true,
      title: 'Helyszíni felmérés',
      body: 'Rögzítjük a pontos méreteket, a műszaki körülményeket és az igényeket.',
    },
    {
      key: 'ajanlat',
      enabled: true,
      title: 'Részletes ajánlat',
      body: 'A felmérés alapján elkészül a pontos, tételes ajánlat.',
    },
    {
      key: 'megrendeles',
      enabled: true,
      title: 'Megrendelés és időpont-egyeztetés',
      body: 'A részletek elfogadása után ütemezzük a kivitelezést.',
    },
    {
      key: 'beepites',
      enabled: true,
      title: 'Beépítés és átadás',
      body: 'Beépítjük a nyílászárókat, ellenőrizzük a működésüket, és átadjuk a munkát.',
    },
  ],
} as const;

export const activeSteps = process.steps.filter((step) => step.enabled);

/* ===========================================================================
 * 9. JOGI SZÖVEGEK ÉS SÜTIK
 * ======================================================================== */

export const legal = {
  /**
   * A jogi szövegek modális ablakban jelennek meg. Ha külön aloldalra
   * tennéd őket, add meg az `href` értéket — akkor linkként viselkednek.
   * JOGI ELLENŐRZÉS NÉLKÜL NE ÉLESÍTSD.
   */
  privacy: {
    title: 'Adatkezelési tájékoztató',
    href: '',
    body: '[Ide kerül a teljes adatkezelési tájékoztató. Tartalmaznia kell legalább: az adatkezelő nevét és elérhetőségét, a kezelt adatok körét, az adatkezelés célját és jogalapját, a megőrzési időt, az adatfeldolgozókat, és az érintett jogait.]',
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
