/**
 * ============================================================================
 *  ÁRAK — EURÓBAN
 * ============================================================================
 *
 *  Minden ár euróban van, mert a nyílászárók listaára is euróban érkezik.
 *  A kalkulátor a megjelenítéskor váltja át forintra az aznapi árfolyammal
 *  (lásd `exchange`), így árfolyamváltozáskor nem kell semmit átírni.
 *
 *  Ami itt 0, ahhoz még nincs ár: a kalkulátor az ilyen tételt nem
 *  számolja bele az összegbe, hanem külön jelzi. Kitalált árat nem írunk be.
 * ============================================================================
 */

/** Az árfolyam-lekérés beállításai. */
export const exchange = {
  /**
   * Élő EUR/HUF árfolyam. Az Európai Központi Bank napi középárfolyama,
   * kulcs nélkül hívható, CORS engedélyezett. Ha más forrást használnál
   * (pl. MNB), csak ezt az URL-t és a `readRate` függvényt kell átírni.
   */
  url: 'https://api.frankfurter.app/latest?from=EUR&to=HUF',

  /**
   * Tartalék árfolyam, ha a lekérés nem sikerül (offline, blokkolt hálózat).
   * Ilyenkor az oldal jelzi, hogy tájékoztató árfolyammal számol.
   * Érdemes néha frissíteni.
   */
  fallbackRate: 400,
  fallbackDate: '[TARTALÉK ÁRFOLYAM DÁTUMA]',

  /** Nyilvánvalóan hibás választ eldobunk: ezen a sávon kívüli érték gyanús. */
  minRate: 250,
  maxRate: 700,

  /** Az átváltott forintösszeg kerekítése — a hamis pontosság félrevezető. */
  roundTo: 1000,
} as const;

/**
 * VISION fix ablak mérettáblázat. Az értékek EUR/darab árak, a magasság
 * (sor) és a szélesség (oszlop) sávjának metszéspontjában.
 *
 * Forrás: a gyártói mérettáblázat. A táblázat NEM tartalmazza a 6 mm-es
 * vagy vastagabb üveg, illetve az osztó felárát, és nem tartalmazza a
 * beépítést sem.
 */
export const fixWindow = {
  label: 'Fix ablak',
  minSize: '350 × 400 mm',
  note: 'A gyártói mérettáblázat szerinti listaár. Nem tartalmazza a 6 mm-es vagy vastagabb üveg, illetve az osztó felárát.',
  widths: ['50-60', '61-70', '71-80', '81-90', '91-100', '101-110', '111-120', '121-130', '131-140', '141-150', '151-160', '161-170', '171-180', '181-190', '191-200'],
  heights: ['50-60', '61-70', '71-80', '81-90', '91-100', '101-110', '111-120', '121-130', '131-140', '141-150', '151-160', '161-170', '171-180', '181-190', '191-200', '201-210', '211-220', '221-230', '231-240'],
  /** EUR / darab — sorok: magasság, oszlopok: szélesség. */
  prices: [
    [35.5, 38.6, 41.6, 44.7, 47.7, 50.8, 53.9, 56.9, 60, 63, 66.1, 69.1, 72.2, 75.2, 78.3],
    [38.6, 42, 45.4, 48.8, 52.2, 55.6, 59, 62.4, 65.7, 69.1, 72.5, 75.9, 79.3, 82.7, 86.1],
    [41.6, 45.4, 49.1, 52.8, 56.6, 60.3, 64.1, 67.8, 71.5, 75.3, 79, 82.7, 86.5, 90.2, 94],
    [44.7, 48.8, 52.8, 56.9, 61, 65.1, 69.2, 73.2, 77.3, 81.4, 85.5, 89.6, 93.6, 97.7, 101.8],
    [47.7, 52.2, 56.6, 61, 65.4, 69.8, 74.3, 78.7, 83.1, 87.5, 91.9, 96.4, 100.8, 105.2, 109.6],
    [50.8, 55.6, 60.3, 65.1, 69.8, 74.6, 79.4, 84.1, 88.9, 93.7, 98.4, 103.2, 107.9, 112.7, 117.5],
    [53.9, 59, 64.1, 69.2, 74.3, 79.4, 84.5, 89.6, 94.7, 99.8, 104.9, 110, 115.1, 120.2, 125.3],
    [56.9, 62.4, 67.8, 73.2, 78.7, 84.1, 89.6, 95, 100.5, 105.9, 111.4, 116.8, 122.2, 127.7, 133.1],
    [60, 65.7, 71.5, 77.3, 83.1, 88.9, 94.7, 100.5, 106.2, 112, 117.8, 123.6, 129.4, 135.2, 141],
    [63, 69.1, 75.3, 81.4, 87.5, 93.7, 99.8, 105.9, 112, 118.2, 124.3, 130.4, 136.5, 142.7, 148.8],
    [66.1, 72.5, 79, 85.5, 91.9, 98.4, 104.9, 111.4, 117.8, 124.3, 130.8, 137.2, 143.7, 150.2, 156.6],
    [69.1, 75.9, 82.7, 89.6, 96.4, 103.2, 110, 116.8, 123.6, 130.4, 137.2, 144, 150.9, 157.7, 164.5],
    [72.2, 79.3, 86.5, 93.6, 100.8, 107.9, 115.1, 122.2, 129.4, 136.5, 143.7, 150.9, 158, 165.2, 172.3],
    [75.2, 82.7, 90.2, 97.7, 105.2, 112.7, 120.2, 127.7, 135.2, 142.7, 150.2, 157.7, 165.2, 172.5, 180.1],
    [78.3, 86.1, 94, 101.8, 109.6, 117.5, 125.3, 133.1, 141, 148.8, 156.6, 164.5, 172.3, 180.1, 188],
    [81.3, 89.5, 97.7, 105.9, 114, 122.2, 130.4, 138.6, 146.8, 154.9, 163.1, 171.3, 179.5, 187.6, 195.8],
    [84.4, 92.9, 101.4, 109.9, 118.5, 127, 135.5, 144, 152.5, 161.1, 169.6, 178.1, 186.6, 195.1, 203.6],
    [87.4, 96.3, 105.2, 114, 122.9, 131.7, 140.6, 149.5, 158.3, 167.2, 176, 184.9, 193.8, 202.6, 211.5],
    [90.5, 99.7, 108.9, 118.1, 127.3, 136.5, 145.7, 154.9, 164.1, 173.3, 182.5, 191.7, 200.9, 210.1, 219.3],
  ],
} as const;

/**
 * A többi tétel egységára euróban, darabonként.
 * 0 = még nincs ár. Küldd el a gyártói táblázatot, és ide kerül.
 */
export const unitPrices = {
  /** Nyíló / bukó-nyíló ablak — mérettáblázat kell hozzá. */
  openingWindow: 0,
  /** Erkély- vagy teraszajtó. */
  balconyDoor: 0,
  /** Bejárati ajtó. */
  entranceDoor: 0,
  /** Kiegészítők nyílászárónként. */
  shutter: 0,
  insectScreen: 0,
  sill: 0,
  /** Beépítés bontással és helyreállítással, nyílászárónként. */
  installation: 0,
} as const;
