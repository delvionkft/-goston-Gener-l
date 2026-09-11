# Nyílászáró landing oldal

Egyoldalas, konverzióra optimalizált landing oldal nyílászárós vállalkozásnak.
React + Vite + TypeScript, külső UI-könyvtár és animációs függőség nélkül.

Az oldal célja nem a bemutatkozás, hanem **ajánlatkérés és telefonhívás
generálása**. Minden szekció ide vezet vissza.

## Indítás

```bash
npm install
npm run dev
```

Az oldal a `http://localhost:5173` címen fut.

## Parancsok

| Parancs | Mit csinál |
| --- | --- |
| `npm run dev` | Fejlesztői szerver |
| `npm run build` | Éles build a `dist/` mappába |
| `npm run preview` | Az éles build helyi kiszolgálása |
| `npm run typecheck` | TypeScript-ellenőrzés |
| `npm run lint` | Linter |
| `npm run check:content` | Kilistázza a még kitöltetlen helyőrzőket |
| `npm run check` | A három ellenőrzés egyben |

---

## 1. Tartalom kitöltése

**Minden cégspecifikus adat egyetlen fájlban van: `src/config/site.ts`.**
A komponensekben nincs hardcode-olt üzleti adat.

A kitöltetlen értékek szögletes zárójelben állnak (`[CÉGNÉV]`), és az oldalon
vizuálisan meg vannak jelölve — fejlesztői módban sárga kiemeléssel, éles
buildben dőlt, halványabb szedéssel. Így nem lehet véletlenül kitöltetlenül
élesíteni.

```bash
npm run check:content
```

Ez kilistázza az összes maradék helyőrzőt sorszámmal, és hibával áll le, ha
maradt ilyen — CI-ba is beköthető.

### Kitöltési sorrend

1. `company` — cégnév, szolgáltatási terület, tapasztalat, adószám, székhely
2. `contact` — telefonszám (megjelenített **és** `tel:` formátum), e-mail,
   nyitvatartás, válaszidő. Két szám esetén lásd lentebb.
3. `socialLinks` — csak a ténylegesen létező oldalak
4. `site.url` — az éles domain (canonical és Open Graph)
5. `site.title` / `site.description` — böngészőfül és meta description
6. `hero.points` — a négy bizalmi állítás **ellenőrzése**
7. `services` — szolgáltatások (lásd lentebb az `enabled` kapcsolót)
8. `references.items` — **csak valós, elvégzett munkák**
9. `process.steps` — a tényleges munkafolyamat
10. `legal` — adatkezelési tájékoztató és impresszum (jogi ellenőrzéssel)

### Két telefonszám

A `contact` elsődleges és másodlagos számot különböztet meg:

| Mező | Hol jelenik meg |
| --- | --- |
| `phoneDisplay` / `phoneHref` | **Minden hívásgomb**: hero, fejléc, mobil CTA-sáv, és az elérhetőségi listák |
| `phoneSecondaryDisplay` / `phoneSecondaryHref` | Csak az elérhetőségi felsorolásokban (űrlap melletti blokk, záró szekció, footer) |

Ez szándékos: a hívásgomb egyetlen számot tárcsáz. Ha a látogatónak a hívás
pillanatában két szám közül kell választania, az plusz döntés — és minden
plusz döntés elvisz hívásokat. A másodlagos szám elérhető marad, csak nem
gombon.

A másodlagos mezőt üresen hagyva sehol nem jelenik meg. A strukturált
adatban mindkét szám szerepel.

### Az `enabled` kapcsoló

A `services` és a `process.steps` elemei ki-be kapcsolhatók:

```ts
{ key: 'helyreallitas', label: 'Bontás utáni helyreállítás', enabled: false, ... }
```

`false` esetén a szolgáltatás **sehol** nem jelenik meg: sem a kártyák között,
sem az űrlap választólistájában, sem a referenciaszűrőben, sem a strukturált
adatban. Egy nem vállalt szolgáltatás ugyanolyan félrevezető, mint egy kitalált
referencia — ezért lett külön kapcsoló, nem kommentelés.

> Az oldalon szándékosan nincs kitalált referencia, ügyfélvélemény, statisztika,
> kedvezmény vagy garancia. Ami nincs meg, helyőrző marad.

### Ügyfélvélemények

A `testimonials` tömb szándékosan üres. Amíg üres, a blokk nem jelenik meg.
Valós, hozzájárulással megosztható visszajelzést vehetsz fel ide — kitalált
nevet és szöveget ne.

---

## 2. Képek

Tedd a képeket a `public/` mappába, és írd be az útvonalukat a
`src/config/site.ts` megfelelő `image` mezőjébe (pl. `'/hero.webp'`).

Amíg egy `image` mező üres, egy jelölt képhelyőrző jelenik meg a helyes
képaránnyal — így az elrendezés nem ugrik meg, amikor beteszed a valódi képet.

| Hely | Mező | Ajánlott méret | Képarány |
| --- | --- | --- | --- |
| Logó | `company.logo` | SVG vagy 360×88 PNG | — |
| Hero | `hero.image` | 1200×1500 | 4:5 |
| Szolgáltatáskártya | `services[].image` | 1200×720 | 5:3 |
| Referencia | `references.items[].image` | 1200×900 | 4:3 |
| Előtte-utána | `references.items[].beforeImage` / `afterImage` | 1200×900 | 4:3 |

Minden képhez kötelező az `imageAlt` — ez kerül az `alt` attribútumba.

**Logó:** amíg a `company.logo` üres, a fejlécben egy egyszerű márkajel, a
footerben a cégnév szöveges változata jelenik meg. Törött képikon tehát nem
fordulhat elő akkor sem, ha még nincs logó.

Ajánlás: **WebP vagy AVIF**, 200 kB alatt. A hero képe `priority` betöltést kap
(nincs lazy load), minden más lustán töltődik.

**Előtte-utána:** ha egy referenciánál mind a `beforeImage`, mind az
`afterImage` ki van töltve, a nagy nézetben automatikusan összehasonlító csúszka
jelenik meg, a kártyán pedig „Előtte–utána" jelölés. Ha csak az egyik van meg,
sima kép jelenik meg.

**Favicon és OG kép:** `public/favicon.svg` és a `site.ogImage` által hivatkozott
fájl cseréje. A `public/robots.txt`, `public/sitemap.xml` és az `index.html`
canonical linkjében írd át az `example.hu` domaint.

---

## 3. Űrlapok bekötése

Mindkét ajánlatkérő űrlap ugyanazon az egy függvényen megy keresztül:
**`src/lib/submitLead.ts`**.

Állítsd be a végpontot egy `.env` fájlban (minta: `.env.example`):

```
VITE_LEAD_ENDPOINT=https://api.sajatceg.hu/leads
```

A `toPayload()` függvényben igazítsd a mezőneveket a CRM-ed sémájához.
Ha nem REST API-t használsz, a `send()` törzsét cseréld le.

### Üzemmódok

| Helyzet | Viselkedés |
| --- | --- |
| Végpont beállítva | Valódi beküldés |
| Nincs végpont, `npm run dev` | Konzolra ír, sikert jelez |
| Nincs végpont, éles build | **Hibát jelez** — szándékosan |
| `VITE_LEAD_ENDPOINT=demo` | Sikert mutat, de sehova nem küld (bemutatóhoz) |

Az éles build szándékosan hibát jelez bekötetlen végponttal: így nem lehet
észrevétlenül elveszíteni valós érdeklődőt egy félig bekötött oldalon.

### Mezők

Név, telefonszám, e-mail, **település**, milyen munkára van szükséged, rövid
üzenet, adatkezelési hozzájárulás. Kötelező: név, telefon, település,
hozzájárulás. Az e-mail szándékosan opcionális — a telefon az elsődleges
csatorna, és minden kötelező mező csökkenti a kitöltési arányt.

A „milyen munkára van szükséged" lista automatikusan a bekapcsolt
szolgáltatásokból áll össze, nem kell külön karbantartani.

### Spamvédelem

Két réteg, mindkettő külső szolgáltatás és sütik nélkül:

1. **Rejtett csapdamező** (honeypot) — a botok kitöltik, ember nem látja.
2. **Minimális kitöltési idő** — a megjelenés utáni 2,5 másodpercen belüli
   beküldést eldobjuk.

Mindkettő csendben „sikert" mutat, így a bot nem tudja meg, min bukott el.
A dobott beküldés `form_error` eseményként `reason: 'spam_filter'` címkével
megjelenik a mérésben — így látod, ha véletlenül valós forgalmat szűrnél ki.

Ha ennél erősebb védelem kell (pl. tömeges támadás után), ide illeszthető egy
láthatatlan CAPTCHA — de csak a sütikonszent rendezése után.

---

## 4. Mérés (GA4 / GTM / Google Ads / Meta Pixel)

Minden konverziós esemény a **`src/lib/analytics.ts`** `track()` függvényén megy
át. A komponensek nem tudnak a konkrét mérőrendszerekről.

| Esemény | Mikor |
| --- | --- |
| `cta_quote_click` | Bármelyik ajánlatkérő gomb (`placement` mondja meg, melyik) |
| `phone_click` | Telefonszámra kattintás |
| `email_click` | E-mail-címre kattintás |
| `form_start` | Az űrlap első érdemi kitöltése (űrlaponként egyszer) |
| `form_submit_top` | Az első űrlap sikeres beküldése |
| `form_submit_bottom` | A záró űrlap sikeres beküldése |
| `form_error` | Mezőhiba, sikertelen beküldés vagy spamszűrés |
| `service_open` | Szolgáltatáskártya lenyitása |
| `reference_open` | Referenciakép megnyitása |
| `reference_filter` | Referenciaszűrő használata |
| `nav_click`, `process_step_view` | Navigáció, idővonal-görgetés |

**Bekötés:**

- **GTM** — nincs teendő. Az események a `window.dataLayer`-be kerülnek
  `event: '<név>'` kulccsal; GTM-ben Custom Event triggerrel elkaphatók.
- **GA4 közvetlenül** — a `window.gtag` automatikusan meghívódik.
- **Google Ads** — a `GOOGLE_ADS` objektumban add meg a `conversionId`-t
  (`AW-...`) és az eseményekhez tartozó konverziócímkéket. Amíg a
  `conversionId` üres, a konverziós hívás nem fut le.
- **Meta Pixel** — a `META_PIXEL_MAP` táblában rendeld hozzá a saját
  eseményeidhez a Meta standard eseményeit.

Illeszd be a mérőkódot az `index.html` `<head>` szakaszába.

### Sütikonszent

A mérés csak hozzájárulás után fut. Addig az események sorba állnak, és a
hozzájárulás megadásakor visszamenőleg elsülnek — így nem vész el az első
kattintás. A döntés a `localStorage`-ban tárolódik, és a footer
„Cookie-beállítások" pontjából bármikor módosítható. A Google Consent Mode v2
jelzései automatikusan frissülnek.

---

## 5. Felépítés

```
src/
  config/site.ts        ← MINDEN tartalom és cégadat itt
  lib/
    submitLead.ts       ← CRM / API bekötési pont
    analytics.ts        ← mérési réteg (GA4 / GTM / Ads / Pixel)
    validation.ts       ← űrlap-mezőellenőrzés
    seo.ts              ← cím, meta, Open Graph, LocalBusiness adat
    contact.ts          ← tel: / mailto: linkek
    scroll.ts           ← horgonyra görgetés
  hooks/                ← megjelenési animáció, fókuszcsapda, reduced-motion
  components/
    QuoteForm.tsx       ← az ajánlatkérő űrlap (mindkét helyen ugyanaz)
    WindowFigure.tsx    ← ablakrajz a problémajelölésekkel
    Hotspots.tsx        ← információs pontok a hero képen
    BeforeAfter.tsx     ← előtte-utána csúszka
    Lightbox.tsx        ← nagyított referencianézet
    …
  sections/             ← az oldal hét szekciója
  styles/
    tokens.css          ← színek, tipográfia, térközök
    base.css            ← reset és közös osztályok
```

Minden komponensnek saját CSS-fájlja van, ugyanazon a néven.

---

## 6. Design tokenek

A színek, betűméretek és térközök a `src/styles/tokens.css` fájlban vannak
CSS-változóként. A márkapaletta változtatásához elég ez az egy fájl.

**Betűtípus:** címsorokhoz Montserrat, folyószöveghez Inter. A Montserrat nagy
méretben határozott, de hosszabb bekezdésben az Inter olvashatóbb.

**Footer háttérfelirat:** a cégnév nagy, halvány felirata (`Wordmark`) nem
fix betűmérettel készül, hanem megméri a szöveg természetes szélességét, és
pontosan akkorára kicsinyíti, hogy kiférjen. Egy fix `clamp(…, 20vw, …)`
hosszabb névnél két-három képernyőnyi széles lenne, és a felirat eleje-vége
levágódna. A mérés `offsetWidth`-tel megy, nem `getBoundingClientRect()`-tel:
az utóbbi a transzformált szélességet adná vissza, tehát a saját
kicsinyítését mérné újra. Újramér átméretezéskor és a betűtípus betöltése
után is.

**Szemcse:** az egész oldal fölött egy rögzített, SVG-zajból generált
szemcseréteg ül (`body::after` a `base.css`-ben). Ez adja az anyagszerű
hatást; nincs hozzá képfájl, és nem fogja el a kattintást. Erősségét az
`opacity` szabályozza.

**Szekciósorszám:** minden szekció jobb felső sarkában körvonalas sorszám
áll (`01`, `02`, …). CSS-számláló készíti a `.section > .container::before`
elemen, ezért a komponenseket nem kell módosítani, és új szekció
beszúrásakor magától újraszámozódik. Feltétele, hogy a szekciónak legyen
pontosan egy közvetlen `.container` gyereke.

**Görgetéscsík:** a fejléc alsó élén fut (`ScrollProgress`, a `Header`-en
belül). `scaleX`-szel skálázódik, nem szélességgel, és CSS-változóra ír,
nem React-állapotra — így a görgetés nem indít sem újratördelést, sem
újrarenderelést.

**Világos–sötét ritmus:** a problémafelvetés, a szolgáltatások záró CTA-ja,
a záró ajánlatkérő és a footer sötét. Enélkül az egész oldal egyetlen bézs
felületté folyna össze — az értékkontraszt tagolja a szekciókat.

**CTA-szín (`--c-cta`, `#16544F`):** a paletta egyébként végig meleg barna. Ha a
főgomb is barna lenne, semmi nem emelkedne ki belőle. Ez a mély zöld kizárólag
az elsődleges konverziós gombokon jelenik meg — ha máshol is használod, elveszti
a súlyát.

**Kontraszt:** a `#A67C52` világos háttéren csak 3.3:1, ami szöveghez kevés
(a WCAG AA 4.5:1-et vár). Ezért ez a szín kizárólag dekorációra megy — ikon,
keret, elválasztó vonal —, ahol a küszöb 3:1. Szöveghez a `--c-accent-text`
(`#7E5430`, 5.7:1) van beállítva. A CTA-szín fehér felirattal 8.7:1, bézs
háttéren szövegként 7.6:1.

---

## 7. Amit tudni érdemes a szekciókról

- **Hero** — az oldal egyetlen `<h1>`-e. A képen információs pontok vannak
  (`hero.hotspots`); ezek valódi gombok, érintéssel és billentyűzettel is
  működnek. Ha nem kellenek, ürítsd ki a tömböt.
- **Problémák** — az ablakrajz vektoros (`WindowFigure`), nem fotó: nulla
  képletöltés, és nem kelti azt a látszatot, hogy egy konkrét elvégzett munkát
  mutat. A jelölések helyét a `problem.items[].hotspot` adja meg, a rajz
  `viewBox`-ának százalékában.
- **Szolgáltatások** — kártyarács lenyitható részletekkel. Alapból minden
  kártya csukva, hogy a rács egyenletes legyen.
- **Referenciák** — a szűrő csak azokból a kategóriákból épül fel, amelyekhez
  ténylegesen tartozik referencia, így nincs üres találatra vezető gomb.
  A lapozás „További munkák" gombbal működik.
- **Folyamat** — középvonalas, váltakozó idővonal. Szándékosan nem vízszintes:
  hét lépés vízszintesen olvashatatlanul keskeny oszlopokat adna. Görgetéskor a
  lépések egyenként aktiválódnak; csökkentett mozgásnál azonnal mind aktív.
- **Rögzített CTA** — mobilon alsó sáv, asztali nézetben lebegő gomb. Mindkettő
  eltűnik, amikor egy ajánlatkérő űrlap látszik, hogy ne takarja a mezőket.
- **Futószalag** (`Marquee`) — a hero alatt a bekapcsolt szolgáltatások
  végtelenített sávja. Csökkentett mozgás esetén nem animál, helyette
  oldalra görgethető. Hoverre megáll.
- **Görgetésjelző** (`ScrollProgress`) — az oldal tetején. CSS-változóra ír,
  nem React-állapotra, így a görgetés nem indít újrarenderelést.
- **Fényfolt a kártyákon** (`useSpotlight`) — kurzorkövető fény a
  szolgáltatás- és referenciakártyákon. Egyetlen figyelő ül a rácson, nem
  kártyánként egy. Érintőképernyőn és csökkentett mozgásnál ki van kapcsolva.

### Hosszú magyar szavak

A címsorok `overflow-wrap: break-word` + `hyphens: auto` beállítást kapnak, a
rácselemek pedig `min-width: 0`-t. Enélkül egy hosszú összetett szó
(„kompromisszumok", „árnyékolástechnika") szélesebb lesz, mint a rácsoszlop,
és kitolja az egész elrendezést a képernyőről — amit a `body { overflow-x:
hidden }` csak **elrejt**, nem old meg. Ha új, hosszú szót teszel címsorba,
ellenőrizd 360 px széles nézetben.

---

## 8. Élesítés előtti ellenőrzőlista

- [ ] `npm run check` hibátlanul lefut
- [ ] `src/config/site.ts` minden helyőrzője kitöltve
- [ ] Telefonszám `tel:` formátumban is megadva (`+36301234567`)
- [ ] A `services` és `process.steps` `enabled` kapcsolói a valósághoz igazítva
- [ ] Valós képek a `public/` mappában, `image` mezők beállítva
- [ ] `site.url`, `index.html` canonical, `robots.txt`, `sitemap.xml` domainje átírva
- [ ] Favicon és OG kép lecserélve
- [ ] `VITE_LEAD_ENDPOINT` beállítva, és a beküldés **valóban megérkezik**
- [ ] Adatkezelési tájékoztató és impresszum jogilag ellenőrzött szöveggel
- [ ] Mérőkód beillesztve az `index.html`-be, események ellenőrizve
- [ ] Google Ads `conversionId` és címkék beállítva, ha fut hirdetés
