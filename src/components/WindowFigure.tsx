import './WindowFigure.css';

export interface WindowMarker {
  key: string;
  /** Rövid felirat a jelölés mellett. */
  short: string;
  /** Teljes megnevezés a képernyőolvasónak. */
  label: string;
  hotspot: { x: number; y: number };
}

interface Props {
  markers: readonly WindowMarker[];
  activeKey: string;
  onSelect: (key: string) => void;
}

/**
 * Ablakillusztráció a tipikus problémák jelölésével.
 *
 * Vektoros, nem fotó: nulla képletöltés, minden felbontáson éles, és nem
 * kelti azt a látszatot, hogy egy konkrét elvégzett munkát mutatunk.
 * A rajz maga dekoratív (`aria-hidden`), a jelentést a fölötte lévő
 * valódi gombok hordozzák — így a szekció billentyűzettel is bejárható.
 */
export function WindowFigure({ markers, activeKey, onSelect }: Props) {
  return (
    <div className="winfig">
      <svg
        className="winfig__svg"
        viewBox="0 0 200 250"
        role="img"
        aria-label="Ablak vázlatrajza, rajta a leggyakoribb problémák jelölésével"
      >
        <defs>
          <linearGradient id="winfig-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DCE6E6" />
            <stop offset="46%" stopColor="#EFF3F1" />
            <stop offset="100%" stopColor="#C9D6D6" />
          </linearGradient>
          <linearGradient id="winfig-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="100%" stopColor="#E4D9C9" />
          </linearGradient>
        </defs>

        {/* Fal */}
        <rect x="0" y="0" width="200" height="250" fill="var(--c-beige-deep)" />

        {/* Káva árnyéka */}
        <rect x="14" y="12" width="172" height="186" rx="2" fill="rgba(59,38,24,0.07)" />

        {/* Tok */}
        <rect x="18" y="16" width="164" height="178" rx="2" fill="url(#winfig-frame)" />
        <rect
          x="18"
          y="16"
          width="164"
          height="178"
          rx="2"
          fill="none"
          stroke="var(--c-line)"
          strokeWidth="1"
        />

        {/* Üvegfelületek */}
        <rect x="27" y="25" width="69" height="160" fill="url(#winfig-glass)" />
        <rect x="104" y="25" width="69" height="160" fill="url(#winfig-glass)" />

        {/* Fényvisszaverődés az üvegen */}
        <path d="M36 185 96 68v34L58 185Z" fill="#FFFFFF" opacity="0.35" />
        <path d="M113 185 173 68v22l-79 95Z" fill="#FFFFFF" opacity="0.28" />

        {/* Szárnykeretek */}
        <rect
          x="27"
          y="25"
          width="69"
          height="160"
          fill="none"
          stroke="var(--c-sand-light)"
          strokeWidth="4"
        />
        <rect
          x="104"
          y="25"
          width="69"
          height="160"
          fill="none"
          stroke="var(--c-sand-light)"
          strokeWidth="4"
        />

        {/* Középső függőleges osztó */}
        <rect x="96" y="16" width="8" height="178" fill="url(#winfig-frame)" />
        <line x1="96" y1="16" x2="96" y2="194" stroke="var(--c-line)" strokeWidth="0.8" />
        <line x1="104" y1="16" x2="104" y2="194" stroke="var(--c-line)" strokeWidth="0.8" />

        {/* Kilincs */}
        <rect x="106" y="116" width="5" height="18" rx="2.5" fill="var(--c-brown-500)" />
        <rect x="108" y="122" width="16" height="4" rx="2" fill="var(--c-brown-500)" />

        {/* Párkány */}
        <rect x="10" y="194" width="180" height="13" rx="1.5" fill="var(--c-sand)" />
        <rect x="10" y="207" width="180" height="4" rx="1.5" fill="rgba(59,38,24,0.18)" />
      </svg>

      {/* A jelölések valódi gombok a rajz fölött. */}
      <div className="winfig__markers">
        {markers.map((marker) => (
          <button
            key={marker.key}
            type="button"
            className={`winmarker ${activeKey === marker.key ? 'is-active' : ''}`}
            style={{ left: `${marker.hotspot.x}%`, top: `${marker.hotspot.y}%` }}
            aria-pressed={activeKey === marker.key}
            onClick={() => onSelect(marker.key)}
          >
            <span className="winmarker__dot" aria-hidden="true" />
            <span className="winmarker__label" aria-hidden="true">
              {marker.short}
            </span>
            <span className="visually-hidden">{marker.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
