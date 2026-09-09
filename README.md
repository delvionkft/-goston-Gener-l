# Landing oldal

Egyoldalas, konverzióra optimalizált landing oldal. React + Vite + TypeScript,
külső UI-könyvtár és animációs függőség nélkül.

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

A még kitöltetlen értékek szögletes zárójelben állnak (`[CÉGNÉV]`), és az
oldalon vizuálisan meg vannak jelölve — fejlesztői módban sárga kiemeléssel,
éles buildben dőlt, halványabb szedéssel. Így nem lehet véletlenül
kitöltetlenül élesíteni.

Ellenőrzés bármikor:

```bash
npm run check:content
```

Ez kilistázza az összes maradék helyőrzőt sorszámmal, és hibával áll le, ha
maradt ilyen — CI-ba is beköthető.

### Kitöltési sorrend

1. `company` — cégnév, fő szolgáltatás, bemutatkozás, szolgáltatási terület
2. `contact` — telefonszám (megjelenített **és** `tel:` formátum), e-mail
3. `site.url` — az éles domain (a canonical és az Open Graph adatokhoz)
4. `hero.points` — négy rövid, **valós** előny
5. `problem.items` — 3–4 konkrét fájdalompont
6. `solution.tabs` — a szolgáltatások
7. `references.items` — **csak valós, elvégzett munkák**
8. `process.steps` — a tényleges munkafolyamat
9. `legal` — adatkezelési tájékoztató és impresszum (jogi ellenőrzéssel)

> Az oldalon szándékosan nincs kitalált referencia, ügyfélvélemény,
> statisztika vagy garancia. Amíg nincs valós adat, helyőrző marad.

---

## 2. Képek

Tedd a képeket a `public/` mappába, és írd be az útvonalukat a
`src/config/site.ts` megfelelő `image` mezőjébe (pl. `'/hero.jpg'`).

Amíg egy `image` mező üres, egy jelölt képhelyőrző jelenik meg a helyes
képaránnyal — így az elrendezés nem ugrik meg, amikor beteszed a valódi képet.

| Hely | Mező | Ajánlott méret | Képarány |
| --- | --- | --- | --- |
| Hero | `hero.image` | 1200×1500 | 4:5 |
| Szolgáltatások | `solution.tabs[].image` | 1200×960 | 5:4 |
| Referenciák | `references.items[].image` | 1200×1600 | 3:4 |

Minden képhez kötelező az `imageAlt` — ez kerül az `alt` attribútumba.

Ajánlás: WebP vagy AVIF formátum, 200 kB alatt. A hero képe `priority`
betöltést kap (nincs lazy load), minden más lustán töltődik.

**Favicon és OG kép:** `public/favicon.svg` és a `site.ogImage` által
hivatkozott fájl cseréje. A `public/robots.txt`, `public/sitemap.xml` és az
`index.html` canonical linkjében írd át az `example.hu` domaint.

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

---

## 4. Mérés (GA4 / GTM / Meta Pixel)

Minden konverziós esemény a **`src/lib/analytics.ts`** `track()` függvényén
megy át. A komponensek nem tudnak a konkrét mérőrendszerekről.

| Esemény | Mikor |
| --- | --- |
| `cta_quote_click` | Bármelyik ajánlatkérő gomb (`placement` mondja meg, melyik) |
| `phone_click` | Telefonszámra kattintás |
| `email_click` | E-mail-címre kattintás |
| `form_submit_top` | Az első űrlap sikeres beküldése |
| `form_submit_bottom` | A záró űrlap sikeres beküldése |
| `form_error` | Mezőhiba vagy sikertelen beküldés |
| `reference_open` | Referenciakép megnyitása |
| `nav_click`, `process_step_view` | Navigáció, idővonal-görgetés |

**Bekötés:**

- **GTM** — nincs teendő. Az események a `window.dataLayer`-be kerülnek
  `event: '<név>'` kulccsal; GTM-ben Custom Event triggerrel elkaphatók.
- **GA4 közvetlenül** — a `window.gtag` automatikusan meghívódik.
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
    analytics.ts        ← mérési réteg
    validation.ts       ← űrlap-mezőellenőrzés
    seo.ts              ← cím, meta, Open Graph, strukturált adat
    contact.ts          ← tel: / mailto: linkek
    scroll.ts           ← horgonyra görgetés
  hooks/                ← megjelenési animáció, fókuszcsapda, reduced-motion
  components/           ← újrahasználható elemek (gomb, űrlap, modális, lightbox…)
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

**Kontrasztról:** a megadott `#A67C52` akcentszín világos háttéren csak
3.3:1 kontrasztot ad, ami szöveghez kevés (a WCAG AA 4.5:1-et vár). Ezért ez a
szín kizárólag dekorációra megy — ikon, keret, elválasztó vonal —, ahol a
küszöb 3:1. Szöveghez a `--c-accent-text` (`#7E5430`, 5.7:1) van beállítva.
A többi színpár ellenőrizve, mind megfelel.

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
