# PRD — Ágoston-Generál Kft. landing oldal

## Eredeti feladat
Meglévő, kész React 19 + Vite 8 + TypeScript landing oldal átvétele és élesítése
(repo: github.com/delvionkft/-goston-Gener-l, ág: claude/trusting-volta-aqwm26).
A design és szövegek késznek tekintendők, NE legyenek újragenerálva.
Blokkoló: a lead-beküldő végpont (VITE_LEAD_ENDPOINT) hiányzott.

## Architektúra
- Frontend: a klónozott Vite SPA az /app/frontend alatt fut, supervisor `yarn start` →
  `vite --host 0.0.0.0 --port 3000 --strictPort` (vite.config.ts: allowedHosts: true).
- Backend: meglévő FastAPI (port 8001) — új `POST /api/leads` végpont, Mongo `leads` kollekció.
- `VITE_LEAD_ENDPOINT=https://landing-deploy-48.preview.emergentagent.com/api/leads` a frontend/.env-ben.
- A szövegek továbbra is egy helyen: src/config/site.ts; színtokenek: src/styles/tokens.css;
  Meta Pixel consent-logika: src/lib/analytics.ts — ezek érintetlenek.

## Megvalósítva (2026-07-01 / dátum a környezet szerint 2026-09-18)
- Repo klónozva és átemelve /app/frontend-be, supervisor alatt fut.
- /api/leads végpont: fogadja a toPayload() mezőit, MongoDB-be ment (receivedAt-tel).
- Ellenőrizve: desktop + 360px mobil nézet, nincs vízszintes túlcsordulás, sütisáv működik,
  többlépcsős ajánlatkérő űrlap renderel, lead POST ok:true.

## Backlog (a README szerinti hiányzók)
- P0: Leadek e-mail kézbesítése agostongeneral@gmail.com felé (Emergent-kezelt Resend).
- P0: GA4/GTM mérőkód bekötése (index.html minta alapján, Consent Mode v2).
- P1: Adatkezelési tájékoztató + impresszum (tárhelyszolgáltató) — site.ts legal blokk.
- P1: og-image.png (1200×630) a public/ mappába.
- P1: Éles domain beállítása (index.html canonical + site.url).
- P2: Árkalkulátor hiányzó egységárai (src/config/pricing.ts).
- P2: 10 kitöltetlen szöveghelyőrző (`npm run check:content` listázza).

## Következő lépések
1. Resend e-mail bekötés a leadekhez.
2. GA4 mérőszám bekérése és bekötése.
3. Jogi szövegek kitöltése.
