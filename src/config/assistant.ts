/**
 * ============================================================================
 *  AJÁNLATKÉRŐ ASSZISZTENS — a beszélgetés forgatókönyve
 * ============================================================================
 *
 *  MIÉRT VEZETETT PÁRBESZÉD, ÉS NEM SZABAD SZÖVEGŰ AI-CHAT?
 *
 *  1. Egy nyelvi modellhez API-kulcs és szerveroldal kell. Kulcsot a
 *     böngészőbe tenni azonnali visszaélés — bárki elolvassa és
 *     elhasználja a kereted.
 *  2. Egy szabad szövegű modell olyan terméket, árat, határidőt vagy
 *     garanciát is ígérhet, amit a cég nem vállal. Nyílászáróknál ez nem
 *     elméleti kockázat, hanem üzleti és jogi.
 *  3. Konverzióra ez a forma erősebb: a cél nem a beszélgetés, hanem
 *     minősített ajánlatkérés. Négy kattintás gyorsabb, mint gépelni.
 *
 *  Az asszisztens tehát determinisztikus: csak azt mondja, ami itt le van
 *  írva, és a végén átadja az adatokat az ajánlatkérő űrlapnak.
 *
 *  HA KÉSŐBB VALÓDI AI KELL:
 *  a `src/lib/assistantAi.ts` fájlban van egy előkészített bekötési pont.
 *  Szerveroldali végpontot vár, nem közvetlen modellhívást.
 * ============================================================================
 */

export interface AssistantOption {
  /** A gombon megjelenő szöveg. */
  label: string;
  /** Opcionális rövid magyarázat a gomb alatt. */
  hint?: string;
}

export interface AssistantStep {
  key: 'service' | 'scope' | 'timing' | 'city';
  /** Az asszisztens kérdése. */
  question: string;
  /** Rövid kísérőszöveg a kérdés alatt. */
  note?: string;
  /**
   * Válaszlehetőségek. Ha üres, szabad szöveges mező jelenik meg —
   * ezt a település megadásához használjuk.
   */
  options: readonly AssistantOption[];
  /** Szabad szöveges mező helykitöltő szövege. */
  placeholder?: string;
}

export const assistant = {
  /** A lebegő gomb felirata. */
  launcher: 'Segítek választani',
  /** A panel fejléce. */
  title: 'Ajánlatkérő asszisztens',
  subtitle: 'Négy kérdés, és összeállítom az ajánlatkérésed.',
  greeting:
    'Szia! Segítek kitalálni, mire van szükséged. Négy rövid kérdés, utána már csak az elérhetőséged kell.',
  /** Mennyit „gondolkodik" válasz előtt, ezredmásodpercben. */
  typingMs: 520,

  steps: [
    {
      key: 'scope',
      placeholder: undefined,
      question: 'Hány nyílászáróról van szó?',
      note: 'Elég a nagyságrend, nem kell pontos szám.',
      options: [
        { label: '1–2 darab' },
        { label: '3–5 darab' },
        { label: '6–10 darab' },
        { label: 'Több mint 10' },
        { label: 'Még nem tudom' },
      ],
    },
    {
      key: 'timing',
      placeholder: undefined,
      question: 'Mikorra tervezed a munkát?',
      note: 'Ez segít, hogy reálisan tudjunk időpontot ajánlani.',
      options: [
        { label: 'Minél előbb' },
        { label: '1–3 hónapon belül' },
        { label: '3–6 hónapon belül' },
        { label: 'Csak tájékozódom' },
      ],
    },
    {
      key: 'city',
      question: 'Melyik településen van az ingatlan?',
      note: 'A helyszíni felmérés megszervezéséhez kell.',
      options: [],
      placeholder: 'Pl. Balatonkeresztúr',
    },
  ] as readonly AssistantStep[],

  /** A záró képernyő szövegei. */
  summaryTitle: 'Ennyi elég is volt',
  summaryLead: 'Ezt viszem át az ajánlatkérésbe — már csak az elérhetőséged kell.',
  primaryCta: 'Átviszem az űrlapra',
  secondaryCta: 'Inkább telefonálok',
  restart: 'Újrakezdem',
} as const;
