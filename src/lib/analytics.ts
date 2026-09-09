/**
 * ============================================================================
 *  MÉRÉSI RÉTEG
 * ============================================================================
 *
 *  Egyetlen belépési pont minden konverziós eseményhez. A komponensek csak a
 *  `track()` függvényt hívják — nem tudnak a GA4-ről, a GTM-ről vagy a Pixelről.
 *
 *  BEKÖTÉS:
 *  - Google Tag Manager: semmi teendő. Az események a `window.dataLayer`-be
 *    kerülnek `event: '<név>'` kulccsal, GTM-ben Custom Event triggerrel
 *    elkaphatók.
 *  - GA4 (gtag.js közvetlenül): a `window.gtag` automatikusan meghívódik,
 *    ha a mérőkód betöltött.
 *  - Meta Pixel: a `META_PIXEL_MAP` táblában rendeld hozzá a saját
 *    eseményeidhez a Meta standard eseményeket.
 *
 *  A mérés csak akkor fut, ha a látogató hozzájárult a statisztikai vagy
 *  marketing sütikhez (lásd `setConsent`). Enélkül az események eldobódnak.
 * ============================================================================
 */

export type AnalyticsEvent =
  | 'cta_quote_click'
  | 'phone_click'
  | 'email_click'
  | 'form_submit_top'
  | 'form_submit_bottom'
  | 'form_error'
  | 'reference_open'
  | 'nav_click'
  | 'process_step_view';

export interface AnalyticsParams {
  [key: string]: string | number | boolean | undefined;
}

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta Pixel standard eseménynevek a saját eseményekhez rendelve. */
const META_PIXEL_MAP: Partial<Record<AnalyticsEvent, string>> = {
  form_submit_top: 'Lead',
  form_submit_bottom: 'Lead',
  phone_click: 'Contact',
  email_click: 'Contact',
};

let consent: ConsentState = { analytics: false, marketing: false };

/** A hozzájárulás megérkezéséig sorba állított események. */
const queue: { name: AnalyticsEvent; params: AnalyticsParams }[] = [];

const isBrowser = typeof window !== 'undefined';

/**
 * Beállítja a sütikonszentet. A süti-sávból hívjuk.
 * Hozzájárulás után a sorba állított események kiürülnek.
 */
export function setConsent(next: ConsentState): void {
  const wasBlocked = !consent.analytics && !consent.marketing;
  consent = next;

  if (isBrowser) {
    // Google Consent Mode v2 — csak ha a gtag betöltött.
    window.gtag?.('consent', 'update', {
      analytics_storage: next.analytics ? 'granted' : 'denied',
      ad_storage: next.marketing ? 'granted' : 'denied',
      ad_user_data: next.marketing ? 'granted' : 'denied',
      ad_personalization: next.marketing ? 'granted' : 'denied',
    });
  }

  if (wasBlocked && (next.analytics || next.marketing)) {
    const pending = queue.splice(0, queue.length);
    for (const item of pending) dispatch(item.name, item.params);
  }
}

function dispatch(name: AnalyticsEvent, params: AnalyticsParams): void {
  if (!isBrowser) return;

  // 1) Google Tag Manager dataLayer
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: name, ...params });

  // 2) GA4 közvetlenül (ha nincs GTM)
  if (consent.analytics) {
    window.gtag?.('event', name, params);
  }

  // 3) Meta Pixel
  if (consent.marketing) {
    const metaEvent = META_PIXEL_MAP[name];
    if (metaEvent) window.fbq?.('track', metaEvent, params);
  }

  if (import.meta.env.DEV) {
    // Fejlesztés közben látszik, mi sülne el élesben.
    console.info('[analytics]', name, params);
  }
}

/**
 * Konverziós esemény küldése.
 *
 * @example track('phone_click', { placement: 'hero' })
 */
export function track(name: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (!consent.analytics && !consent.marketing) {
    // Ne veszítsük el az eseményt, ha a látogató később hozzájárul.
    if (queue.length < 40) queue.push({ name, params });
    if (import.meta.env.DEV) console.info('[analytics:queued]', name, params);
    return;
  }
  dispatch(name, params);
}
