/**
 * A kalkulátor aktuális beállítása, hogy az ajánlatkéréssel együtt
 * elküldhető legyen.
 *
 * Szándékosan nincs hozzá React context: egyetlen, oldal szintű értékről
 * van szó, amit egy helyen írunk (kalkulátor) és egy helyen olvasunk
 * (űrlap beküldése). Így nem kell a fél komponensfán átvezetni.
 */

export interface EstimateSummary {
  /** Ember által olvasható összefoglaló, pl. „3 ablak, 1 bejárati ajtó…”. */
  text: string;
  /** A becsült ársáv, ha vannak valós árak. Egyébként undefined. */
  from?: number;
  to?: number;
}

let current: EstimateSummary | null = null;

export function setEstimate(value: EstimateSummary | null): void {
  current = value;
}

export function getEstimate(): EstimateSummary | null {
  return current;
}

/** Egységes, magyar formátumú árkiírás. */
export function formatPrice(value: number, currency: string): string {
  return `${new Intl.NumberFormat('hu-HU').format(Math.round(value))} ${currency}`;
}
