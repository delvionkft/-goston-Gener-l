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

import { emailEnabled, emailjs } from '../config/email';

export interface LeadData {
  /** A kérdőív minősítő válaszai. */
  propertyType: string;
  windowCount: string;
  needs: string;
  timing: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  consent: boolean;
  /** A kalkulátor beállítása, ha a látogató használta. */
  estimate?: string;
  /** Honnan jött a lead — a mérésnél és a CRM-ben is hasznos. */
  source: string;
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
    propertyType: data.propertyType,
    windowCount: data.windowCount,
    needs: data.needs,
    timing: data.timing,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    city: data.city.trim(),
    estimate: data.estimate ?? '',
    message: data.message.trim(),
    consent: data.consent,
    source: data.source,
    page: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Az EmailJS-sablonnak átadott mezők. A sablonban PONTOSAN ezekre a
 * nevekre kell hivatkozni ({{name}}, {{phone}} stb.), különben üres marad.
 *
 * A `consent` szándékosan szövegként megy: a sablonban a true/false
 * értéket a legtöbb nézőke üresen hagyná.
 */
function toTemplateParams(data: LeadData): Record<string, string> {
  const p = toPayload(data);
  return {
    name: p.name,
    phone: p.phone,
    email: p.email,
    city: p.city,
    propertyType: p.propertyType,
    windowCount: p.windowCount,
    needs: p.needs,
    timing: p.timing,
    estimate: p.estimate,
    message: p.message,
    consent: p.consent ? 'igen' : 'nem',
    source: p.source,
    page: p.page,
    referrer: p.referrer,
    submittedAt: p.submittedAt,
    /* Ha a sablonban beállítod a „Reply To" mezőt erre, a levélre
       válaszolva közvetlenül az érdeklődőnek írsz. */
    reply_to: p.email,
  };
}

/**
 * E-mail értesítés küldése az EmailJS-en keresztül.
 *
 * Az EmailJS böngészős REST végpontját hívjuk, külön függőség nélkül —
 * a hivatalos SDK is pontosan ezt csinálja.
 */
async function sendEmail(data: LeadData): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(emailjs.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailjs.serviceId,
        template_id: emailjs.templateId,
        user_id: emailjs.publicKey,
        template_params: toTemplateParams(data),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`EmailJS ${response.status}: ${detail || 'ismeretlen hiba'}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

/** Beküldés a saját végpontra (ha be van állítva). */
async function sendToEndpoint(data: LeadData): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT as string, {
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
 *
 * KÉT FÜGGETLEN CSATORNA
 * Az e-mail értesítés (EmailJS) és a saját végpont egymástól függetlenül
 * fut. A beküldés akkor sikeres, ha LEGALÁBB AZ EGYIK célba ért: ha az
 * adatbázis nem elérhető, de az e-mail kiment, az érdeklődő akkor is
 * eljutott hozzátok — ilyenkor hiba helyett sikert kell mutatni, különben
 * a látogató újraküldi, és kétszer kapjátok meg.
 *
 * Ha egyik csatorna sincs beállítva, éles buildben HIBÁT jelzünk. Ez
 * szándékos: így nem lehet észrevétlenül elveszíteni valós érdeklődőt.
 */
export async function submitLead(data: LeadData): Promise<SubmitResult> {
  if (DEMO_MODE) {
    console.warn('[submitLead] BEMUTATÓ MÓD — az adat sehova nem került elküldésre.', toPayload(data));
    await new Promise((r) => setTimeout(r, 700));
    return { ok: true };
  }

  const channels: { name: string; run: () => Promise<void> }[] = [];
  if (emailEnabled) channels.push({ name: 'e-mail', run: () => sendEmail(data) });
  if (ENDPOINT) channels.push({ name: 'végpont', run: () => sendToEndpoint(data) });

  if (channels.length === 0) {
    if (import.meta.env.DEV) {
      console.warn(
        '[submitLead] Nincs beállítva sem e-mail küldés, sem VITE_LEAD_ENDPOINT. ' +
          'Fejlesztői módban a beküldés csak szimulált.',
        toPayload(data),
      );
      await new Promise((r) => setTimeout(r, 700));
      return { ok: true };
    }
    return {
      ok: false,
      error: 'A beküldés most nem sikerült. Próbáld újra, vagy hívj minket telefonon.',
    };
  }

  const results = await Promise.allSettled(channels.map((c) => c.run()));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`[submitLead] A(z) ${channels[index].name} csatorna hibázott:`, result.reason);
    }
  });

  if (results.some((r) => r.status === 'fulfilled')) return { ok: true };

  const timedOut = results.some(
    (r) => r.status === 'rejected' && r.reason instanceof DOMException && r.reason.name === 'AbortError',
  );

  return {
    ok: false,
    error: timedOut
      ? 'A beküldés túl sokáig tartott. Ellenőrizd az internetkapcsolatot, és próbáld újra.'
      : 'A beküldés most nem sikerült. Próbáld újra, vagy hívj minket telefonon.',
  };
}
