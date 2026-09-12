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
  name: '[CÉGNÉV]' as MaybePlaceholder,
  /** Rövid név / logószöveg a fejléchez. */
  shortName: '[CÉGNÉV]' as MaybePlaceholder,
  /** A fő szolgáltatás rövid megnevezése. Ez kerül a meta titlebe is. */
  mainService: 'nyílászárócsere és beépítés',
  /** 1–2 mondatos bemutatkozás. A meta descriptionbe is ez kerül. */
  intro:
    'Műanyag nyílászárók, bejárati ajtók, redőnyök és árnyékolás — pontos helyszíni felméréssel, átlátható ajánlattal és szakszerű beépítéssel.',
  /** Szolgáltatási terület, pl. „Budapest és Pest vármegye”. */
  serviceArea: '[SZOLGÁLTATÁSI TERÜLET]' as MaybePlaceholder,
  /** Logó a fejlécbe és a footerbe. Tedd a fájlt a /public mappába. Pl. '/logo.svg'. */
  logo: '',
} as const;

export const contact = {
  /** Megjelenített telefonszám. */
  phoneDisplay: '[TELEFONSZÁM]' as MaybePlaceholder,
  /** Tárcsázható formátum a `tel:` linkhez, szóköz nélkül. Pl. '+36301234567'. */
  phoneHref: '[TELEFONSZÁM]' as MaybePlaceholder,
  email: '[E-MAIL-CÍM]' as MaybePlaceholder,
  /** Opcionális. Ha üres, nem jelenik meg. */
  address: '',
  /** Elérhetőségi idő rövid szövege. Ha üres, nem jelenik meg. */
  hours: '',
} as const;

/**
 * Közösségi média. Csak a kitöltött elemek jelennek meg a footerben —
 * az üres `href` mezőjű sorokat az oldal kihagyja.
 */
export const social = [
  { label: 'Facebook', href: '' },
  { label: 'Instagram', href: '' },
] as const;

export const site = {
  /** Éles URL. A canonical linkhez és az Open Graph adatokhoz kell. */
  url: 'https://example.hu',
  locale: 'hu_HU',
  /** OG kép a /public mappában. Ajánlott: 1200×630 px. */
  ogImage: '/og-image.png',
} as const;

/**
 * Meta címke szövegek. Ezek kerülnek a böngészőfülre, a Google
 * találati listájába és a közösségi megosztás előnézetébe.
 *
 * Ajánlott hossz: cím 50–60, leírás 140–160 karakter. Írj bele
 * településnevet vagy régiót — helyi szolgáltatónál ez hoz találatot.
 */
export const seo = {
  title: '[META TITLE — pl. Nyílászárócsere és beépítés | CÉGNÉV]' as MaybePlaceholder,
  description:
    '[META DESCRIPTION — pl. Műanyag nyílászárók, bejárati ajtók és redőnyök beépítéssel TELEPÜLÉS és környéke területén. Ingyenes helyszíni felmérés, tételes ajánlat.]' as MaybePlaceholder,
} as const;

/* ---------------------------------------------------------------------------
 * 2. CTA-SZÖVEGEK
 *
 *  Szándékosan kevés változat van: a látogatónak végig ugyanazt az egy
 *  ígéretet kell látnia. Ha átírod, itt írd át — az egész oldalon frissül.
 * ------------------------------------------------------------------------ */

export const cta = {
  /** A fő ajánlatkérő gomb szövege mindenhol. */
  primary: 'Ingyenes felmérést kérek',
  /** Rövidített változat szűk helyre (fejléc, mobil sáv). */
  short: 'Ingyenes felmérés',
  /** A hero másodlagos gombja. */
  secondary: 'Megnézem a szolgáltatásokat',
} as const;

/* ---------------------------------------------------------------------------
 * 3. NAVIGÁCIÓ ÉS HORGONYOK
 * ------------------------------------------------------------------------ */

export const ANCHOR = {
  hero: 'fooldal',
  problem: 'problemak',
  services: 'szolgaltatasok',
  why: 'miert-minket',
  process: 'folyamat',
  references: 'referenciak',
  testimonials: 'velemenyek',
  faq: 'gyik',
  form: 'ajanlatkeres',
} as const;

export const navLinks = [
  { id: ANCHOR.services, label: 'Szolgáltatások' },
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
  eyebrow: company.serviceArea,
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
      text: 'Ahhoz igazítjuk a javaslatot, amilyen az épület és amire használod.',
    },
    {
      title: 'Precíz helyszíni felmérés',
      text: 'Milliméterre pontos méretek, a beépítés körülményeivel együtt.',
    },
    {
      title: 'Szakszerű beépítés',
      text: 'A beépítés ugyanolyan fontos, mint maga az ablak — nálunk egy kézben van.',
    },
  ],
  /**
   * Hero kép: világos, modern családi ház vagy prémium enteriőr nagy
   * nyílászárókkal. Tedd a fájlt a /public mappába, pl. '/hero.webp'.
   * Ajánlott: 1200×1500 px, WebP vagy AVIF, 200 kB alatt.
   */
  image: '',
  imageAlt: '[Képaláírás: pl. világos nappali nagyméretű, modern ablakokkal]',
} as const;

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
  lead:
    'Egy helyen a teljes nyílászáró-kör: a nyílászárótól az árnyékoláson át a beépítésig. Így nem neked kell több kivitelezőt összehangolnod.',
  items: [
    {
      key: 'muanyag',
      icon: 'window' as const,
      title: 'Műanyag nyílászárók',
      body:
        'Ablakok és erkélyajtók családi házba, lakásba, felújításba és új építésbe. A profilt, a vasalatot és az üvegezést ahhoz igazítjuk, amit az adott helyiségtől elvársz.',
      image: '',
      imageAlt: '[Képaláírás: műanyag ablak beépítve]',
    },
    {
      key: 'bejarati',
      icon: 'door' as const,
      title: 'Bejárati ajtók',
      body:
        'Hőszigetelt bejárati ajtók, ahol a biztonság, a zárhatóság és a megjelenés egyszerre számít. Az ajtólap, a tok és a zárszerkezet együtt adja a végeredményt.',
      image: '',
      imageAlt: '[Képaláírás: bejárati ajtó]',
    },
    {
      key: 'arnyekolas',
      icon: 'shutter' as const,
      title: 'Redőnyök és árnyékolástechnika',
      body:
        'Redőnyök kézi és motoros működtetéssel, valamint egyéb árnyékolási megoldások. Nyáron a hőterhelés ellen, télen plusz szigetelő réteg az ablakon.',
      image: '',
      imageAlt: '[Képaláírás: redőny]',
    },
    {
      key: 'szunyoghalo',
      icon: 'mesh' as const,
      title: 'Szúnyoghálók',
      body:
        'Fix, nyíló és rolós kivitelben, ablakra és ajtóra. Méretre készítve, hogy szellőztetés közben is nyugodtan nyitva lehessen hagyni a nyílászárót.',
      image: '',
      imageAlt: '[Képaláírás: szúnyogháló]',
    },
    {
      key: 'parkany',
      icon: 'sill' as const,
      title: 'Párkányok és kiegészítők',
      body:
        'Külső és belső párkányok, takarólécek, vízvetők és a beépítéshez tartozó kiegészítők — ezek zárják le tisztán a nyílászáró és a fal találkozását.',
      image: '',
      imageAlt: '[Képaláírás: külső párkány]',
    },
    {
      key: 'csere',
      icon: 'install' as const,
      title: 'Nyílászárócsere és szakszerű beépítés',
      body:
        'A régi szerkezet bontásától a beépítésen át a helyreállításig. A beépítés minősége határozza meg, mennyit ér a megvásárolt nyílászáró.',
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
    'A nyílászáró önmagában termék. Az alábbiak azok, amiktől a végeredmény is jó lesz — és amiért az ügyfeleink ajánlanak minket tovább.',
  items: [
    {
      title: 'Segítünk kiválasztani a megfelelő műszaki megoldást',
      body:
        'Végigvesszük, melyik helyiségben mi a fontos: hőszigetelés, hangszigetelés, biztonság vagy árnyékolás. Nem a legdrágábbat ajánljuk, hanem azt, aminek nálad értelme van.',
    },
    {
      title: 'Pontos helyszíni felmérést végzünk',
      body:
        'A méreteket a helyszínen vesszük fel, a falszerkezettel és a beépítés körülményeivel együtt. Így nem a kivitelezés napján derül ki, hogy valami nem stimmel.',
    },
    {
      title: 'Átlátható, részletes ajánlatot készítünk',
      body:
        'Tételesen látod, mi mibe kerül, és mi az, ami nincs benne. Így össze tudod hasonlítani más ajánlatokkal, és nincs utólagos meglepetés.',
    },
    {
      title: 'Az egyeztetett feltételek szerint dolgozunk',
      body:
        'Amiben megállapodunk — tartalom, ütemezés, feltételek —, az szerint haladunk. Ha valami változik, előre szólunk, nem utólag.',
    },
    {
      title: 'Precíz beépítést és rendezett munkaterületet biztosítunk',
      body:
        'A beépítést a szakma szabályai szerint végezzük, és a munka végén rendet hagyunk magunk után. Ez nem extra, hanem az alapelvárás.',
    },
    {
      title: 'A kivitelezés után sem hagyjuk magára az ügyfelet',
      body:
        'Ha kérdés vagy beállítási igény merül fel a munka után, elérhetők maradunk. Az ablak évekig veled marad — a kapcsolat is maradjon meg.',
    },
  ],
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
      body: 'Felhívunk, és átbeszéljük az elképzeléseidet, a helyszínt és a várható kereteket.',
    },
    {
      title: 'Helyszíni felmérés',
      body: 'Kimegyünk, pontos méretet veszünk, és megnézzük a beépítés körülményeit.',
    },
    {
      title: 'Pontos ajánlat',
      body: 'Tételes, összehasonlítható ajánlatot készítünk a felmérés alapján.',
    },
    {
      title: 'Részletek egyeztetése',
      body: 'Véglegesítjük a tartalmat, az ütemezést és a kivitelezés feltételeit.',
    },
    {
      title: 'Beépítés',
      body: 'Szakszerűen beépítjük a kiválasztott nyílászárókat, és rendet hagyunk magunk után.',
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
 *  Ha egyik sincs kitöltve, jelölt képhelyőrző jelenik meg.
 * ------------------------------------------------------------------------ */

export const references = {
  eyebrow: 'Referenciák',
  title: 'Elkészült munkáink',
  lead: '[Rövid felvezető: milyen jellegű munkákat mutattok be itt.]',
  /** A csúszkás összehasonlítás címkéi. */
  beforeLabel: 'Előtte',
  afterLabel: 'Utána',
  items: [
    {
      id: 'ref-1',
      location: '[HELYSZÍN]',
      workType: '[ELVÉGZETT MUNKA TÍPUSA]',
      result: '[Rövid eredményleírás: mi változott a munka után.]',
      beforeImage: '',
      beforeAlt: '[Kép: állapot a munka előtt]',
      afterImage: '',
      afterAlt: '[Kép: állapot a munka után]',
    },
    {
      id: 'ref-2',
      location: '[HELYSZÍN]',
      workType: '[ELVÉGZETT MUNKA TÍPUSA]',
      result: '[Rövid eredményleírás: mi változott a munka után.]',
      beforeImage: '',
      beforeAlt: '[Kép: állapot a munka előtt]',
      afterImage: '',
      afterAlt: '[Kép: állapot a munka után]',
    },
    {
      id: 'ref-3',
      location: '[HELYSZÍN]',
      workType: '[ELVÉGZETT MUNKA TÍPUSA]',
      result: '[Rövid eredményleírás: mi változott a munka után.]',
      beforeImage: '',
      beforeAlt: '[Kép: állapot a munka előtt]',
      afterImage: '',
      afterAlt: '[Kép: állapot a munka után]',
    },
    {
      id: 'ref-4',
      location: '[HELYSZÍN]',
      workType: '[ELVÉGZETT MUNKA TÍPUSA]',
      result: '[Rövid eredményleírás: mi változott a munka után.]',
      beforeImage: '',
      beforeAlt: '[Kép: állapot a munka előtt]',
      afterImage: '',
      afterAlt: '[Kép: állapot a munka után]',
    },
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
  lead: 'Valós, az ügyfelektől engedélyezett visszajelzések.',
  /** Az oldalon megjelenő figyelmeztetés, amíg a vélemények helyőrzők. */
  sampleNotice:
    'Mintatartalom — cseréld valós, az ügyféltől engedélyezett véleményre, mielőtt élesíted az oldalt.',
  items: [
    {
      id: 'tes-1',
      quote: '[ÜGYFÉLVÉLEMÉNY 1 — a kommunikációról: mennyire volt követhető az egyeztetés.]',
      author: '[KERESZTNÉV]',
      meta: '[TELEPÜLÉS] · [ELVÉGZETT MUNKA]',
    },
    {
      id: 'tes-2',
      quote: '[ÜGYFÉLVÉLEMÉNY 2 — a pontosságról: az egyeztetett feltételek tartásáról.]',
      author: '[KERESZTNÉV]',
      meta: '[TELEPÜLÉS] · [ELVÉGZETT MUNKA]',
    },
    {
      id: 'tes-3',
      quote: '[ÜGYFÉLVÉLEMÉNY 3 — a kivitelezés minőségéről és a végeredményről.]',
      author: '[KERESZTNÉV]',
      meta: '[TELEPÜLÉS] · [ELVÉGZETT MUNKA]',
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
      a: 'Az ár a mérettől, a nyílászáró típusától, az üvegezéstől, a vasalattól és a beépítés körülményeitől függ, ezért felmérés nélkül csak félrevezető szám adható. A felmérés után tételes ajánlatot kapsz, amiben látod az egyes tételek árát. Tájékoztató nagyságrend: [ÁRSÁV — töltsd ki a saját árszintednek megfelelően, vagy hagyd ki].',
    },
    {
      q: 'Mennyi idő alatt készül el a kivitelezés?',
      a: 'Két külön szakaszból áll: a nyílászárók gyártási ideje és a helyszíni beépítés. A beépítés általában lényegesen rövidebb, mint a gyártás. A rád vonatkozó időzítést az ajánlatban rögzítjük. Jelenlegi tájékoztató határidők: [GYÁRTÁSI IDŐ] és [BEÉPÍTÉSI IDŐ].',
    },
    {
      q: 'Szükséges helyszíni felmérés?',
      a: 'Igen. A meglévő nyílás mérete, a falszerkezet és a beépítés körülményei nélkül nem lehet pontos ajánlatot adni, és a rendelés is kockázatos lenne. A felmérés a mi oldalunkról [FELMÉRÉS FELTÉTELE — pl. díjmentes megrendelés esetén / díjmentes és kötelezettségmentes].',
    },
    {
      q: 'Két- vagy háromrétegű üvegezést érdemes választani?',
      a: 'Nincs egy jó válasz mindenre. A háromrétegű üvegezés jobb hőszigetelést ad, de nehezebb és drágább, és nem minden helyzetben térül meg — például kevéssé fűtött vagy északi tájolású helyiségeknél másképp éri meg, mint egy nagy üvegfelületű nappaliban. A felmérésen helyiségenként átbeszéljük, hol melyiknek van értelme.',
    },
    {
      q: 'A régi nyílászárók bontását is vállaljátok?',
      a: 'Igen, a régi szerkezet bontása és a beépítés utáni helyreállítás is elvégezhető a munka részeként. Hogy pontosan mi tartozik bele — bontás, elszállítás, kőműves helyreállítás, festés —, azt tételesen az ajánlat rögzíti. Az elszállítás nálunk: [BONTOTT ANYAG ELSZÁLLÍTÁSA — pl. az ajánlat tartalmazza / külön tétel].',
    },
    {
      q: 'Redőny és szúnyogháló is kérhető?',
      a: 'Igen, az árnyékolás és a szúnyogháló ugyanannak a megrendelésnek a része lehet. Érdemes együtt tervezni a nyílászáróval, mert így a méretek és a beépítés összehangolhatók, és nem kell később külön kivitelezőt hívni.',
    },
    {
      q: 'Milyen garancia vonatkozik a munkára?',
      a: 'Két dolgot érdemes külön nézni: a termékre a gyártó vállal garanciát, a beépítésre pedig a kivitelező. Mindkettőt az ajánlat és a szerződés rögzíti írásban. A mi feltételeink: [TERMÉKGARANCIA] és [BEÉPÍTÉSI GARANCIA]. A jogszabályi szavatossági jogaid ettől függetlenül megilletnek.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 12. AJÁNLATKÉRŐ SZEKCIÓ ÉS ŰRLAP
 * ------------------------------------------------------------------------ */

export const form = {
  eyebrow: 'Ajánlatkérés',
  title: 'Szeretnéd megtudni, milyen megoldás illik az otthonodhoz?',
  lead:
    'Töltsd ki az űrlapot, és felvesszük veled a kapcsolatot az elképzeléseid egyeztetéséhez.',
  /** „Mi történik a beküldés után” — az űrlap mellett jelenik meg. */
  afterSubmit: [
    'Megnézzük, amit írtál, és összeállítjuk a kérdéseinket.',
    'Felhívunk a megadott telefonszámon, és átbeszéljük az elképzeléseidet.',
    'Időpontot egyeztetünk a helyszíni felmérésre.',
    'A felmérés után elkészítjük a tételes ajánlatot.',
  ],
  /** A „Milyen megoldás érdekel?” választó opciói. */
  serviceOptions: [
    'Műanyag nyílászárók',
    'Bejárati ajtó',
    'Redőny, árnyékolástechnika',
    'Szúnyogháló',
    'Párkányok, kiegészítők',
    'Teljes nyílászárócsere',
    'Még nem tudom',
  ],
  /** A köszönőüzenet szövege sikeres beküldés után. */
  thankYou: {
    title: 'Köszönjük, megkaptuk a kérésed!',
    lead: 'Felvesszük veled a kapcsolatot a megadott telefonszámon.',
    points: [
      'A megkeresésedet rögzítettük, nem vész el.',
      'Ha sürgős, hívj minket nyugodtan közvetlenül is.',
    ],
  },
  /**
   * Opcionális külön köszönőoldal. Ha megadsz egy útvonalat (pl.
   * '/koszonjuk'), sikeres beküldés után az oldal oda navigál — hasznos,
   * ha a GA4-ben oldalletöltés-alapú konverziót mérsz. Üresen hagyva a
   * köszönőüzenet az űrlap helyén jelenik meg.
   */
  thankYouUrl: '',
} as const;

/* ---------------------------------------------------------------------------
 * 13. FOOTER ÉS JOGI SZÖVEGEK
 * ------------------------------------------------------------------------ */

export const legal = {
  privacy: {
    title: 'Adatkezelési tájékoztató',
    /** Ha külön aloldalra tennéd, add meg az URL-t — akkor linkként viselkedik. */
    href: '',
    body: '[Ide kerül a teljes adatkezelési tájékoztató: az adatkezelő neve és elérhetősége, a kezelt adatok köre, az adatkezelés célja és jogalapja, a megőrzési idő, az adatfeldolgozók, és az érintett jogai. Jogi ellenőrzés nélkül ne élesítsd.]',
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
