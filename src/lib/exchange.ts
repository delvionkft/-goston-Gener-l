import { exchange } from '../config/pricing';

/**
 * ============================================================================
 *  EUR → HUF ÁRFOLYAM
 * ============================================================================
 *
 *  Az árak euróban vannak, a látogató viszont forintban gondolkodik. Az
 *  átváltás ezért mindig az aznapi árfolyammal történik, nem beégetett
 *  szorzóval — így árfolyamváltozáskor nincs teendő.
 *
 *  Ha a lekérés bármiért nem megy (offline, blokkolt hálózat, hibás válasz),
 *  a tartalék árfolyammal számolunk, és az oldal ezt jelzi is. Némán rossz
 *  számot nem mutatunk.
 * ============================================================================
 */

export interface Rate {
  /** 1 EUR ennyi forint. */
  value: number;
  /** Az árfolyam dátuma, ahogy a forrás adta. */
  date: string;
  /** Igaz, ha nem sikerült élő árfolyamot szerezni. */
  fallback: boolean;
}

const CACHE_KEY = 'eur-huf-rate';
/** Napon belül nem kérdezzük újra: az EKB középárfolyam naponta frissül. */
const CACHE_MS = 6 * 60 * 60 * 1000;

const fallback: Rate = {
  value: exchange.fallbackRate,
  date: exchange.fallbackDate,
  fallback: true,
};

function readCache(): Rate | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { rate: Rate; at: number };
    if (Date.now() - parsed.at > CACHE_MS) return null;
    return parsed.rate;
  } catch {
    return null;
  }
}

function writeCache(rate: Rate): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rate, at: Date.now() }));
  } catch {
    // A gyorsítótár hiánya nem hiba — legfeljebb újra lekérdezzük.
  }
}

/** A válaszból kiolvassa az árfolyamot. Más forrásnál ezt kell átírni. */
function readRate(data: unknown): { value: number; date: string } | null {
  if (typeof data !== 'object' || data === null) return null;
  const body = data as { rates?: Record<string, unknown>; date?: unknown };
  const value = body.rates?.HUF;
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value < exchange.minRate || value > exchange.maxRate) return null;
  return { value, date: typeof body.date === 'string' ? body.date : '' };
}

/**
 * Lekéri az aznapi árfolyamot. Soha nem dob kivételt: hiba esetén a
 * tartalék árfolyammal tér vissza, `fallback: true` jelöléssel.
 */
export async function fetchRate(): Promise<Rate> {
  const cached = readCache();
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(exchange.url, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) return fallback;

    const parsed = readRate(await response.json());
    if (!parsed) return fallback;

    const rate: Rate = { value: parsed.value, date: parsed.date, fallback: false };
    writeCache(rate);
    return rate;
  } catch {
    return fallback;
  }
}

/** Euró összeg forintra váltva, a konfigurált kerekítéssel. */
export function toHuf(eur: number, rate: number): number {
  const value = eur * rate;
  return Math.round(value / exchange.roundTo) * exchange.roundTo;
}

/** Magyar formátumú forintösszeg. */
export function formatHuf(value: number): string {
  return `${new Intl.NumberFormat('hu-HU').format(Math.round(value))} Ft`;
}

/** Magyar formátumú euróösszeg. */
export function formatEur(value: number): string {
  return `${new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(value)} €`;
}
