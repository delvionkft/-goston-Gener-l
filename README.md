# Nyílászáró landing oldal

Egyoldalas, konverzióra optimalizált landing oldal nyílászárós vállalkozásnak.
React + Vite + TypeScript, külső UI-könyvtár és animációs függőség nélkül.

Az oldal felépítése egyetlen útvonalat jár be:
**probléma → megoldás → miért mi → hogyan dolgozunk → bizonyíték → kérdések → ajánlatkérés.**

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

**Minden cégspecifikus adat és szöveg egyetlen fájlban van:
`src/config/site.ts`.** A komponensekben nincs hardcode-olt üzleti adat.

A még kitöltetlen értékek szögletes zárójelben állnak (`[CÉGNÉV]`), és az
oldalon vizuálisan meg vannak jelölve — fejlesztői módban sárga kiemeléssel,
éles buildben dőlt, halványabb szedéssel. Így nem lehet véletlenül
kitöltetlenül élesíteni.

```bash
npm run check:content
```

Ez kilistázza az összes maradék helyőrzőt sorszámmal, és hibával áll le, ha
maradt ilyen — CI-ba is beköthető.

### Kitöltési sorrend

1. `company` — cégnév, bemutatkozás, működési terület, logó
2. `contact` — telefonszám (megjelenített **és** `tel:` formátum), e-mail
3. `seo` — meta title és meta description (írj bele településnevet)
4. `site.url` — az éles domain (canonical, Open Graph, strukturált adat)
5. `social` — közösségi média linkek (üresen hagyva nem jelennek meg)
6. `references` — **csak valós, elvégzett munkák**, előtte–utána képekkel
7. `testimonials` — **csak valós, az ügyféltől engedélyezett vélemények**
8. `faq` — az árra, határidőre és garanciára vonatkozó helyőrzők kitöltése
9. `legal` — adatkezelési tájékoztató és impresszum (jogi ellenőrzéssel)

> Az oldalon szándékosan nincs kitalált referencia, ügyfélvélemény,
> statisztika, ár, határidő vagy garancia. Amíg nincs valós adat, helyőrző
> marad. A GYIK válaszaiban az ár, a határidő és a garancia ígéretnek
> számít — ezeket csak azzal töltsd ki, amit valóban vállalsz.

### Amit külön érdemes tudni

- **CTA-szövegek:** a `cta` blokkban van a három gombfelirat. Az egész oldal
  ezeket használja, hogy a látogató végig ugyanazt az egy ígéretet lássa.
- **Ügyfélvélemények:** amíg helyőrzők, a szekció láthatóan jelzi, hogy
  mintatartalomról van szó. Ha nincs valós véleményed, inkább vedd ki a
  szekciót az `src/App.tsx` fájlból, mint hogy kitaláltat tegyél bele.

---

## 2. Képek

Tedd a képeket a `public/` mappába, és írd be az útvonalukat a
`src/config/site.ts` megfelelő `image` mezőjébe (pl. `'/hero.webp'`).

| Hely | Fájlnév a `public/` mappában | Ajánlott méret | Képarány | Állapot |
| --- | --- | --- | --- | --- |
| Hero, bal kép | `hero-1.webp` | 840×1050 | 4:5 | kész |
| Hero, középső (legerősebb) | `hero-2.webp` | 840×1050 | 4:5 | kész |
| Hero, jobb kép | `hero-3.webp` | 840×1050 | 4:5 | kész |
| Referenciák (6 db) | `ref-1.webp` … `ref-6.webp` | 1400×1050 | 4:3 | kész |
| Open Graph (megosztás) | `og-image.png` | 1200×630 | 1.91:1 | **hiányzik** |

A három hero kép a referenciafotókból készült 4:5 arányú vágással
(`ref-4`, `ref-5`, `ref-6`). Ha jobb fotó készül, elég felülírni a fájlt
ugyanezzel a névvel — a kódban semmit nem kell átírni.
| Logó (opcionális) | pl. `logo.svg` → `company.logo` | — | — |
| Szolgáltatáskártya (opcionális) | tetszőleges → `services.items[].image` | 1200×750 | 16:10 |

A konfigurációban a képútvonalak **kezdő perjel nélkül** szerepelnek
(`hero-1.webp`, nem `/hero-1.webp`). Így az oldal akkor is megtalálja a
fájlokat, ha nem a domain gyökeréből szolgáljuk ki — például előnézetben
vagy alkönyvtárból.

**Ezek a fájlnevek már be vannak írva a konfigurációba.** Elég a fájlokat a
`public/` mappába feltölteni ezekkel a nevekkel — kódot nem kell módosítani.
Amíg egy fájl hiányzik vagy a neve elír, jelölt képhelyőrző látszik a helyén,
nem törött kép.

Egy előtte–utána párnál a két képnek azonos képarányúnak kell lennie,
különben ugrik az összehasonlítás. Ha egy munkához nincs „előtte" fotó,
töröld a `beforeImage` értékét — akkor egyetlen, nagyítható kép jelenik meg.

Minden képhez kötelező az alt szöveg — ez kerül az `alt` attribútumba.

**Szolgáltatáskártyák:** a kép opcionális. Ha üresen hagyod, a kártya a
letisztult vonalas ikonnal jelenik meg — így fotók nélkül is rendezett az
oldal, nem hat félkésznek.

Ajánlás: WebP vagy AVIF formátum, 200 kB alatt. A hero képe `priority`
betöltést kap (nincs lazy load), minden más lustán töltődik.

**Favicon és domain:** cseréld a `public/favicon.svg` fájlt, és írd át az
`example.hu` domaint a `public/robots.txt`, `public/sitemap.xml` és az
`index.html` canonical linkjében.

---

## 3. Az űrlap bekötése

Az ajánlatkérő űrlap egyetlen függvényen megy keresztül:
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

### Két űrlap az oldalon

Ugyanaz a kérdőív fut két helyen: egy a hero alatt (`source: 'hero-urlap'`),
egy a lap alján (`source: 'fo-urlap'`). A beküldött adatban és a mérésben a
`source` mező különbözteti meg őket, így látszik, melyik hoz több
érdeklődőt.

A gombok mindig a **közelebbi** űrlapra visznek (a hero saját gombja
kivétel: az mindig a közvetlenül alatta lévőre). Így a látogató sosem ugrik
át a fél oldalon a rossz irányba.

### A kérdőív

Az ajánlatkérés öt lépésből áll: négy egyérintéses minősítő kérdés, majd az
elérhetőség. A kérdések és a válaszlehetőségek a `form.questions` tömbben
szerkeszthetők — a `key` értékeket viszont ne írd át, azokra hivatkozik a
kód, a mérés és a CRM-be küldött adat.

| Kérdés | Mezőnév | Mit szűr |
| --- | --- | --- |
| Milyen ingatlanról van szó? | `propertyType` | Releváns-e egyáltalán a munka |
| Hány nyílászárót érint a csere? | `windowCount` | A projekt nagyságrendje |
| Mire van szükséged? | `needs` | Ablak / redőny / szúnyogháló — releváns ajánlat |
| Mikor tervezed? | `timing` | Élő érdeklődés vagy még csak tájékozódás |

Az utolsó lépésen **a név, a telefonszám, az ingatlan települése és az
adatkezelési hozzájárulás kötelező**; az e-mail-cím és az üzenet nem. A
település azért kötelező, mert enélkül olyan megkeresést is felhívnál, ami
eleve kívül esik a kiszolgálási területen.

### Köszönőüzenet vagy köszönőoldal

Alapból a köszönőüzenet az űrlap helyén jelenik meg (`form.thankYou`).
Ha külön köszönőoldalra navigálnál — például mert a GA4-ben oldalletöltés
alapú konverziót mérsz —, add meg az útvonalat a `form.thankYouUrl` mezőben.

---

## 3/B. Árkalkulátor

A kalkulátor minden adata a `src/config/site.ts` **`calculator`** blokkjában
van. Sehol máshol nincs ár a kódban.

**Az árak euróban vannak, a `src/config/pricing.ts` fájlban** — a gyártói
listaárak is euróban érkeznek. A kalkulátor a megjelenítéskor váltja át
forintra az **aznapi árfolyammal**, így árfolyamváltozáskor nincs teendő.

| Mi | Hol | Megjegyzés |
| --- | --- | --- |
| Fix ablak mérettáblázat | `fixWindow.prices` | EUR/darab, sorok = magasság, oszlopok = szélesség |
| Egyéb tételek egységára | `unitPrices` | EUR/darab. **0 = még nincs ár** |
| Árfolyamforrás | `exchange.url` | EKB napi középárfolyam, kulcs nélkül, CORS-barát |
| Tartalék árfolyam | `exchange.fallbackRate` | Ha a lekérés nem megy. Néha frissítsd |
| Kerekítés | `exchange.roundTo` | Alapból ezresre |

**Amihez `0` az ár, azt a kalkulátor nem találja ki**: kihagyja az összegből,
a tételsorban „ár egyeztetés alatt" jelzéssel, és az eredmény alatt kiírja,
mi nincs benne. Kitalált ár a látogató felé ígéret, és az első telefonban
lebukik.

Az árfolyam-lekérés hibája nem töri el az oldalt: ilyenkor a tartalék
árfolyam megy, és az eredmény mellett ott áll, hogy tájékoztató árfolyammal
számolt. Az árfolyamot a böngésző munkamenetére gyorsítótárazzuk, tehát egy
látogatás alatt egyszer kérdezzük le.

Másik árfolyamforrásra váltáshoz elég az `exchange.url` és a
`src/lib/exchange.ts` `readRate()` függvénye.

A kalkulátor beállítása az ajánlatkéréssel együtt elmegy (`estimate` mező),
és a `calculator_use` eseményben is szerepel — így a visszahíváskor látod,
mire számolt az érdeklődő.

---

## 4. Mérés (GA4 / GTM / Meta Pixel)

Minden konverziós esemény a **`src/lib/analytics.ts`** `track()` függvényén
megy át. A komponensek nem tudnak a konkrét mérőrendszerekről.

| Esemény | Mikor |
| --- | --- |
| `cta_quote_click` | Bármelyik ajánlatkérő gomb (`placement` mondja meg, melyik) |
| `phone_click` | Telefonszámra kattintás |
| `email_click` | E-mail-címre kattintás |
| `calculator_use` | A kalkulátor beállításával ajánlatkérésre kattintás |
| `form_step` | Egy kérdőívlépés kitöltése (`step`, `question`, `answer`) — ebből látszik, hol morzsolódik le a kitöltő |
| `form_submit` | **Fő konverzió:** sikeres űrlapbeküldés, a négy minősítő válasszal együtt |
| `form_error` | Mezőhiba vagy sikertelen beküldés |
| `reference_open` | Referenciakép megnyitása |
| `faq_open` | GYIK-kérdés lenyitása |
| `nav_click`, `process_step_view` | Navigáció, idővonal-görgetés |

**Bekötés:** a mérőkódok helye az `index.html` `<head>` szakaszában van,
kikommentezett, bemásolható mintával (Consent Mode v2 → GA4 → Meta Pixel).

- **GTM** — nincs teendő. Az események a `window.dataLayer`-be kerülnek
  `event: '<név>'` kulccsal; GTM-ben Custom Event triggerrel elkaphatók.
- **GA4 közvetlenül** — a `window.gtag` automatikusan meghívódik.
- **Meta Pixel** — a `META_PIXEL_MAP` táblában rendeld hozzá a saját
  eseményeidhez a Meta standard eseményeit.

### Sütikonszent

A mérés csak hozzájárulás után fut. Addig az események sorba állnak, és a
hozzájárulás megadásakor visszamenőleg elsülnek — így nem vész el az első
kattintás. A döntés a `localStorage`-ban tárolódik, és a footer
„Cookie-beállítások” pontjából bármikor módosítható. A Google Consent Mode v2
jelzései automatikusan frissülnek.

---

## 5. Felépítés

```
src/
  config/site.ts        ← MINDEN tartalom és cégadat itt
  lib/
    submitLead.ts       ← CRM / API bekötési pont
    analytics.ts        ← mérési réteg
    validation.ts       ← űrlap-mezőellenőrzés
    seo.ts              ← cím, meta, Open Graph, strukturált adat (LocalBusiness + GYIK)
    contact.ts          ← tel: / mailto: linkek
    scroll.ts           ← horgonyra görgetés
  hooks/                ← megjelenési animáció, fókuszcsapda, reduced-motion
  components/           ← gomb, űrlap, modális, lightbox, előtte–utána csúszka…
  sections/             ← az oldal kilenc szekciója
  styles/
    tokens.css          ← színek, tipográfia, térközök
    base.css            ← reset és közös osztályok
```

Minden komponensnek saját CSS-fájlja van, ugyanazon a néven.

---

## 6. Design tokenek

A színek, betűméretek és térközök a `src/styles/tokens.css` fájlban vannak
CSS-változóként. A márkamegjelenés változtatásához elég ez az egy fájl.

**Tipográfia:** a címsorok és a gombok Montserrat betűtípust használnak, a
folyószöveg Intert. A Montserrat geometrikus, prémium hatású, de hosszabb
bekezdésben fárasztóbb — ezért van a kettő párban. Ha egységesen Montserratot
szeretnél, a `--font-body` értékét írd át ugyanarra.

**Kontraszt:** az akcentszín (`#5A3A25`) fehér felirattal 10.2:1-et ad, bőven
a WCAG AA 4.5:1 fölött. A világosabb `--c-brown-400` kizárólag dekorációra
megy — ikon, keret, elválasztó vonal —, ahol a küszöb 3:1.

---

## 7. Élesítés előtti ellenőrzőlista

- [ ] `npm run check` hibátlanul lefut
- [ ] `src/config/site.ts` minden helyőrzője kitöltve
- [ ] Telefonszám `tel:` formátumban is megadva (`+36301234567`)
- [ ] Valós képek a `public/` mappában, `image` mezők beállítva
- [ ] `site.url`, `index.html` canonical, `robots.txt`, `sitemap.xml` domainje átírva
- [ ] Favicon és OG kép lecserélve
- [ ] `VITE_LEAD_ENDPOINT` beállítva, és a beküldés **valóban megérkezik**
- [ ] Adatkezelési tájékoztató és impresszum jogilag ellenőrzött szöveggel
- [ ] Mérőkód beillesztve az `index.html`-be, események ellenőrizve
- [ ] GYIK-válaszokban nincs olyan ár, határidő vagy garancia, amit nem vállalsz
