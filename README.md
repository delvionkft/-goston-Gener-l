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

| Hely | Mező | Ajánlott méret | Képarány |
| --- | --- | --- | --- |
| Hero | `hero.image` | 1200×1500 | 4:5 |
| Szolgáltatáskártya | `services.items[].image` | 1200×750 | 16:10 |
| Referencia | `references.items[].beforeImage` / `afterImage` | 1200×900 | 4:3 |
| Open Graph | `site.ogImage` | 1200×630 | 1.91:1 |

Minden képhez kötelező az alt szöveg — ez kerül az `alt` attribútumba.

**Szolgáltatáskártyák:** a kép opcionális. Ha üresen hagyod, a kártya a
letisztult vonalas ikonnal jelenik meg — így fotók nélkül is rendezett az
oldal, nem hat félkésznek.

**Referenciák:** ha egy munkához `beforeImage` és `afterImage` is van,
összehasonlító csúszka jelenik meg. Ha csak `afterImage` van, egyetlen kép
látszik, nagyítható nézettel. A két képnek azonos képarányúnak kell lennie,
különben ugrik az összehasonlítás.

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

### Kötelező mezők

Csak a **név**, a **telefonszám** és az **adatkezelési hozzájárulás**
kötelező. Minden más mező opcionális — egy fölöslegesen kötelezővé tett mező
mindig visz el érdeklődőt, a hiányzó adatot pedig úgyis megkérdezed a
visszahíváskor.

### Köszönőüzenet vagy köszönőoldal

Alapból a köszönőüzenet az űrlap helyén jelenik meg (`form.thankYou`).
Ha külön köszönőoldalra navigálnál — például mert a GA4-ben oldalletöltés
alapú konverziót mérsz —, add meg az útvonalat a `form.thankYouUrl` mezőben.

---

## 4. Mérés (GA4 / GTM / Meta Pixel)

Minden konverziós esemény a **`src/lib/analytics.ts`** `track()` függvényén
megy át. A komponensek nem tudnak a konkrét mérőrendszerekről.

| Esemény | Mikor |
| --- | --- |
| `cta_quote_click` | Bármelyik ajánlatkérő gomb (`placement` mondja meg, melyik) |
| `phone_click` | Telefonszámra kattintás |
| `email_click` | E-mail-címre kattintás |
| `form_submit` | **Fő konverzió:** sikeres űrlapbeküldés |
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
