# Nyílászáró landing oldal

Egyoldalas, konverzióra optimalizált landing oldal nyílászárós vállalkozásnak.
React + Vite + TypeScript, külső UI-könyvtár és animációs függőség nélkül.

Az oldal felépítése egyetlen útvonalat jár be:
**probléma → megoldás → miért mi → hogyan dolgozunk → bizonyíték → ajánlatkérés.**

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
8. `faq` — **jelenleg nem jelenik meg az oldalon** (lásd lentebb)
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
| Hero kép (ez látszik) | `hero-2.webp` | 840×1050 | 4:5 | kész |
| Hero, tartalék | `hero-1.webp`, `hero-3.webp` | 840×1050 | 4:5 | nem látszik |
| Logó, világos háttérre | `agoston-ablak-logo.webp` | 755×208 | 3,6:1 | kész |
| Logó, sötét háttérre | `agoston-ablak-logo-light.webp` | 755×208 | 3,6:1 | kész |
| Logó, álló változat | `agoston-ablak-logo-stacked.webp` | 575×584 | 1:1 | tartalék |
| Referenciák (6 db) | `ref-1.webp` … `ref-6.webp` | 1400×1050 | 4:3 | kész |
| Favicon | `favicon-32.png`, `favicon-192.png` | 32 / 192 | 1:1 | kész |
| Apple ikon | `apple-touch-icon.png` | 180×180 | 1:1 | kész |
| Open Graph (megosztás) | `og-image.png` | 1200×630 | 1.91:1 | **hiányzik** |

A hero kétosztatú: balra a szöveg, jobbra **egyetlen** fotó. A kirakott
kép a `site.ts` `hero.gallery` listájának **első** eleme — ha másikat
szeretnél, elég a sorrendet átírni ott. A másik két fájl a mappában
marad, hogy gyorsan cserélhető legyen.

A hero képek a saját referenciafotókból készült 4:5 arányú vágások
(`ref-4`, `ref-5`, `ref-6`). Ha saját fotó készül, elég felülírni a fájlt
ugyanezzel a névvel — a kódban semmit nem kell átírni.

A hat referenciakép az eredeti, vágatlan fotó. Négyen látszik a beépítés
munkaközi állapota (kimonterozó hab, még helyre nem állított fal) a
nyílászáró körül — ez a megrendelő döntése alapján maradt így.

A galéria rácsa a képek számához igazodik: 3 oszlop 1100 px fölött,
2 oszlop 700 px fölött, 1 oszlop mobilon. Ha kettőnél kevesebb kép marad,
a rács szűkebb és középre zárt lesz, hogy ne maradjon üres hasáb.

**Figyelem:** a `hero-2.webp` és a `hero-3.webp` a `ref-5`, illetve a
`ref-6` kivágása — vagyis ugyanaz a hab látszik rajtuk, ami miatt azok a
képek kikerültek a referenciák közül. A galéria a képek számához igazodik,
két képnél is középre zárt marad.

**A logó fekvő elrendezésű**, mert az eredeti álló (ikon fölött a felirat,
alatta a szlogen) a 88 px-es fejlécben 57 px széles lett volna, és a
felirat olvashatatlanná vált. A fekvő változat ugyanabból az artworkből
készült: ikon balra, „ÁGOSTON ABLAK" jobbra. A szlogen a fekvő változatból
kimaradt — fejlécméretben 7 px magas lenne. Az eredeti álló változat a
`-stacked` fájlban megmaradt.
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

Az ajánlatkérés **két független csatornán** mehet ki. A beküldés akkor
sikeres, ha **legalább az egyik** célba ér — ha az adatbázis nem elérhető,
de az e-mail kiment, az érdeklődő akkor is eljutott hozzátok, és a
látogató sikervisszajelzést kap (különben újraküldené, és kétszer
kapnátok meg).

### E-mail értesítés — bekötve

A böngésző az **EmailJS**-en keresztül küld e-mailt. Az azonosítók a
`src/config/email.ts` fájlban vannak; környezeti változóval felülírhatók
(`VITE_EMAILJS_SERVICE_ID`, `..._TEMPLATE_ID`, `..._PUBLIC_KEY`).

A kulcsok **szándékosan nyilvánosak** — az EmailJS kliensoldali kulcsa
ilyen. Visszaélés ellen az EmailJS felületén kell szűkíteni a megengedett
domaineket: **Account → Security → Allowed origins**. Élesítéskor ezt
állítsd be, különben más oldalról is küldhetnek a kvótád terhére.

A sablon ezekre a változónevekre hivatkozhat:

`name`, `phone`, `email`, `city`, `propertyType`, `windowCount`, `needs`,
`timing`, `estimate`, `message`, `consent` („igen" / „nem"), `source`,
`page`, `referrer`, `submittedAt`, `reply_to`.

Amelyikre a sablon nem hivatkozik, azt az EmailJS figyelmen kívül hagyja;
amelyiket a sablon használ, de nem küldjük, az üresen marad.

### Köszönőoldal

Sikeres beküldés után az oldal a **`/koszonjuk.html`** címre navigál
(`form.thankYouUrl` a `site.ts`-ben; ha kiüríted, a köszönő üzenet az
űrlap helyén jelenik meg, navigáció nélkül).

A köszönőoldal **önálló HTML** a `public/` mappában, nem a React
alkalmazás része: így akkor is megjelenik, ha a JavaScript nem fut le, és
minden statikus tárhelyen működik útvonal-átírás nélkül. **Cserébe a
szövege ott van, nem a `site.ts`-ben** — ha a köszönő szöveget átírod a
konfigurációban, a `public/koszonjuk.html`-t is írd át.

`noindex` van rajta: a köszönőoldal nem való a találati listába.

A konverziós esemény (`form_submit`, Meta „Lead") még az űrlap oldalán sül
el, a navigáció előtt — a navigáció 350 ms késleltetéssel indul, hogy a
jelzés biztosan kimenjen. A köszönőoldalon nincs mérőkód, így nincs
duplázás, és nem kell rajta külön sütikezelés.

### Saját végpont — opcionális

`VITE_LEAD_ENDPOINT=https://...` esetén a teljes lead JSON-ban POST-olódik
oda is (adatbázis, CRM). Amíg üres, csak az e-mail megy ki. A mezőneveket
a `toPayload()` függvényben lehet a fogadó oldalhoz igazítani
(`src/lib/submitLead.ts`).

Bemutatóhoz: `VITE_LEAD_ENDPOINT=demo` — semmi nem megy el, a felület
viszont a teljes sikerállapotot mutatja.

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
| `faq_open` | GYIK-kérdés lenyitása (a szekció jelenleg nincs kint) |
| `nav_click`, `process_step_view` | Navigáció, idővonal-görgetés |

**Bekötés:** a mérőkódok helye az `index.html` `<head>` szakaszában van.

- **GTM** — nincs teendő. Az események a `window.dataLayer`-be kerülnek
  `event: '<név>'` kulccsal; GTM-ben Custom Event triggerrel elkaphatók.
- **GA4 / GTM** — még nincs bekötve, a bemásolható minta ott áll
  kikommentezve.
- **Meta Pixel** — **bekötve**, azonosító: `1381730370784885`.

### Meta Pixel

A Meta által adott kód két ponton el lett térítve, szándékosan:

1. **`fbq('consent', 'revoke')` fut az `init` előtt.** Enélkül a Pixel
   azonnal sütit írna és adatot küldene, még mielőtt a látogató a
   sütisávon bármit választott volna.
2. **A `PageView` nem az `index.html`-ből megy.** A `setConsent()` küldi
   el, a `consent grant` jelzéssel együtt, amikor a látogató elfogadja a
   marketingsütiket. Aki nem fogadja el, arról nem megy adat.

A `<noscript>` képpont **kimaradt**. Az oldal JavaScript nélkül nem
renderel semmit (helyette a „engedélyezd a JavaScriptet" üzenet látszik),
tehát ott nincs mit mérni — viszont az a képpont hozzájárulás nélkül is
azonnal elsülne.

Melyik saját eseményből lesz Meta standard esemény, azt a `META_PIXEL_MAP`
tábla mondja meg (`src/lib/analytics.ts`):

| Saját esemény | Meta esemény |
| --- | --- |
| `form_submit` | `Lead` |
| `phone_click` | `Contact` |
| `email_click` | `Contact` |

### Sütikonszent

A mérés csak hozzájárulás után fut. Addig az események sorba állnak, és a
hozzájárulás megadásakor visszamenőleg elsülnek — így nem vész el az első
kattintás. A döntés a `localStorage`-ban tárolódik, és a footer
„Cookie-beállítások” pontjából bármikor módosítható. A Google Consent Mode v2
jelzései automatikusan frissülnek.

---

## 4/B. A gyakori kérdések szekció

**A GYIK szekció jelenleg NEM jelenik meg az oldalon** — a megrendelő
kérésére került ki. A tartalma megmaradt a `src/config/site.ts` `faq`
blokkjában, hogy bármikor visszatehető legyen.

A visszatételhez három helyen kell módosítani:

1. `src/App.tsx` — a `<Faq />` komponens importja és beillesztése
   (a `Testimonials` és a `QuoteSection` közé).
2. `src/config/site.ts` — az `ANCHOR.faq` sor vissza a `SECTIONS` és a
   `navLinks` listába. A szekciószámok (01, 02…) és a tartalomjegyzék
   ebből a listából jönnek, ezért automatikusan újraszámozódnak.
3. `src/lib/seo.ts` — a `setJsonLd('ld-faq', buildFaqSchema())` hívás
   visszaállítása.

**A 3. pont nem hagyható ki, és fordítva sem:** a FAQPage strukturált
adat csak akkor mehet ki, ha a kérdések ténylegesen LÁTHATÓK az oldalon.
Jelölés a hozzá tartozó szöveg nélkül a Google szabályzatába ütközik, és
kézi büntetést vonhat maga után. Ezért a kivételkor ezt is kikapcsoltuk.

---

## 5. Felépítés

```
src/
  config/site.ts        ← MINDEN tartalom és cégadat itt
  lib/
    submitLead.ts       ← CRM / API bekötési pont
    analytics.ts        ← mérési réteg
    validation.ts       ← űrlap-mezőellenőrzés
    seo.ts              ← cím, meta, Open Graph, strukturált adat (LocalBusiness)
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

**A paletta öt színből áll:**

| Szerep | Érték | Hol jelenik meg |
| --- | --- | --- |
| Olívás arany / bronz | `#9B8245` (`--c-gold`) | logó, menü, gombok, díszítőelemek |
| Antracit | `#1A1A1A`–`#3A3A3A` (`--c-ink-*`) | sötét felületek, kiemelt blokkok, lábléc |
| Fehér | `#FFFFFF` | fejléc, világos felületek, felirat sötét háttéren |
| Sötétszürke szöveg | `#444444` / `#555555` | folyószöveg és másodlagos címek |
| Világosszürke | `#F3F3F1` / `#F7F7F7` | háttérváltás, szekciók elválasztása |

**Kontraszt.** A tiszta márkaarany fehéren 3.7:1 — ez **dekorációra elég**
(küszöb 3:1), folyószöveghez nem. Ezért két külön arany van:

- `--c-gold` (`#9B8245`) — keret, ikon, vonal, gombfelület.
- `--c-accent-text` (`#6E5B2F`) — minden aranyszínű **szöveg** (6.6:1).

Az elsődleges gomb a tiszta márkaarany, de a felirata majdnem fekete
(`#1A1A1A`, 4.7:1) — fehér felirattal csak 3.7:1 lenne, ami elbukna.
A gombszínek ezért fix értékek a `Button.css`-ben, nem tokenek: egy
paletta-átszínezés nem mozdíthatja el a kézzel ellenőrzött kontrasztot.

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
