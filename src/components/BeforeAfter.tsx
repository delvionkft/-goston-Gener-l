import { useId, useState } from 'react';
import './BeforeAfter.css';

interface Props {
  beforeSrc: string;
  beforeAlt: string;
  afterSrc: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
  /** Képarány CSS-formában. Mindkét képnek ugyanez lesz. */
  ratio?: string;
  sizes?: string;
}

/**
 * Előtte–utána összehasonlítás csúszkával.
 *
 * A csúszka egy natív `input[type=range]`: egérrel húzható, érintéssel
 * működik, és billentyűzetről a nyílbillentyűkkel is állítható —
 * képernyőolvasóval is bejelentett, érthető vezérlő. Egyedi egérfigyelő
 * helyett ez adja a legjobb akadálymentességet a legkevesebb kóddal.
 */
export function BeforeAfter({
  beforeSrc,
  beforeAlt,
  afterSrc,
  afterAlt,
  beforeLabel,
  afterLabel,
  ratio = '4 / 3',
  sizes,
}: Props) {
  const uid = useId();
  const [pos, setPos] = useState(50);

  return (
    <div
      className="ba"
      style={{ '--pos': `${pos}%`, '--ratio': ratio } as React.CSSProperties}
    >
      {/* Alsó réteg: az elkészült állapot, teljes szélességben. */}
      <img className="ba__img" src={afterSrc} alt={afterAlt} loading="lazy" decoding="async" sizes={sizes} />

      {/* Felső réteg: a munka előtti állapot, a csúszkáig levágva. */}
      <div className="ba__clip" aria-hidden="true">
        <img className="ba__img" src={beforeSrc} alt="" loading="lazy" decoding="async" sizes={sizes} />
      </div>

      {/* A levágott kép leírása a képernyőolvasónak is elérhető marad. */}
      <span className="visually-hidden">{beforeAlt}</span>

      <span className="ba__tag ba__tag--before" aria-hidden="true">
        {beforeLabel}
      </span>
      <span className="ba__tag ba__tag--after" aria-hidden="true">
        {afterLabel}
      </span>

      <div className="ba__divider" aria-hidden="true">
        <span className="ba__handle" />
      </div>

      <label className="visually-hidden" htmlFor={`${uid}-range`}>
        {beforeLabel}–{afterLabel} csúszka
      </label>
      <input
        id={`${uid}-range`}
        className="ba__range"
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${pos}% ${beforeLabel.toLowerCase()}`}
      />
    </div>
  );
}
