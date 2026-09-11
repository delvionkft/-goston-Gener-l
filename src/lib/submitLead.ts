/**
 * ============================================================================
 *  ŰRLAP BEKÜLDÉSE — CRM / API BEKÖTÉSI PONT
 * ============================================================================
 *
 *  Az egész oldalon ez az egyetlen hely, ahol a lead adat kimegy. A
 *  komponensek csak a `submitLead()` függvényt ismerik.
 *
 *  BEKÖTÉS ÉLESÍTÉSKOR:
 *  1. Állítsd be a `VITE_LEAD_ENDPOINT` környezeti változót (.env fájlban)
 *     a saját végpontodra. Példa:
 *         VITE_LEAD_ENDPOINT=https://api.sajatceg.hu/leads
 *  2. Ha a CRM más mezőneveket vár, írd át a `toPayload()` függvényt.
 *  3. Ha nem REST API-t használsz (pl. e-mail küldő szolgáltatás vagy
 *     szerver nélküli form-backend), cseréld le a `send()` törzsét.
 *
 *  HÁROM ÜZEMMÓD:
 *  - Beállított végpont  → valódi beküldés.
 *  - Nincs végpont, fejlesztői mód → konzolra ír, sikert jelez.
 *  - Nincs végpont, éles build → HIBÁT jelez. Ez szándékos: így nem lehet
 *    észrevétlenül elveszíteni valós érdeklődőt egy félig bekötött oldalon.
 *
 *  BEMUTATÓHOZ: ha éles buildben is látni szeretnéd a sikeres beküldés
 *  visszajelzését (ügyfélprezentáció, demó), állítsd be:
 *      VITE_LEAD_ENDPOINT=demo
 *  Ilyenkor az adat sehova nem megy el, a felület viszont a teljes
 *  sikerállapotot mutatja. Éles indulás előtt cseréld valós végpontra.
 * ============================================================================
 */

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  message: string;
  consent: boolean;
  /** Melyik űrlapról jött — a mérésnél és a CRM-ben is hasznos. */
  source: 'top' | 'bottom';
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

const RAW_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined;
/** Bemutató mód: a felület sikert mutat, de az adat sehova nem megy el. */
const DEMO_MODE = RAW_ENDPOINT?.trim().toLowerCase() === 'demo';
const ENDPOINT = DEMO_MODE ? undefined : RAW_ENDPOINT;
const TIMEOUT_MS = 15000;

/** A CRM felé küldött adatszerkezet. Itt igazítsd a saját sémádhoz. */
function toPayload(data: LeadData) {
  return {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    city: data.city.trim(),
    service: data.service,
    message: data.message.trim(),
    consent: data.consent,
    source: data.source,
    page: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    submittedAt: new Date().toISOString(),
  };
}

async function send(data: LeadData): Promise<void> {
  if (DEMO_MODE) {
    console.warn(
      '[submitLead] BEMUTATÓ MÓD — az adat sehova nem került elküldésre.',
      toPayload(data),
    );
    await new Promise((r) => setTimeout(r, 700));
    return;
  }

  if (!ENDPOINT) {
    if (import.meta.env.DEV) {
      console.warn(
        '[submitLead] Nincs beállítva VITE_LEAD_ENDPOINT. ' +
          'Fejlesztői módban a beküldés csak szimulált.',
        toPayload(data),
      );
      await new Promise((r) => setTimeout(r, 700));
      return;
    }
    throw new Error(
      'A beküldési végpont nincs beállítva (VITE_LEAD_ENDPOINT).',
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toPayload(data)),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`A szerver ${response.status} hibakóddal válaszolt.`);
    }
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Elküldi a lead adatot. Soha nem dob kivételt — a hívó a `SubmitResult`
 * alapján dönt, mit mutasson a felhasználónak.
 */
export async function submitLead(data: LeadData): Promise<SubmitResult> {
  try {
    await send(data);
    return { ok: true };
  } catch (error) {
    const isAbort = error instanceof DOMException && error.name === 'AbortError';
    const message = isAbort
      ? 'A beküldés túl sokáig tartott. Ellenőrizd az internetkapcsolatot, és próbáld újra.'
      : 'A beküldés most nem sikerült. Próbáld újra, vagy hívj minket telefonon.';

    if (import.meta.env.DEV) console.error('[submitLead]', error);
    return { ok: false, error: message };
  }
}
