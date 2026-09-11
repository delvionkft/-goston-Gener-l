import { useId, useState } from 'react';
import './BeforeAfter.css';

interface Props {
  beforeSrc: string;
  beforeAlt: string;
  afterSrc: string;
  afterAlt: string;
  ratio?: string;
}

/**
 * Előtte-utána képösszehasonlító.
 *
 * A csúszka egy valódi `input[type=range]`: egérrel húzható, érintéssel
 * működik, és billentyűzettel nyílbillentyűkkel állítható — külön
 * kódsor nélkül. Mindkét kép mindig a DOM-ban van a saját `alt`
 * szövegével, így képernyőolvasóval is értelmezhető a tartalom.
 */
export function BeforeAfter({
  beforeSrc,
  beforeAlt,
  afterSrc,
  afterAlt,
  ratio = '4 / 3',
}: Props) {
  const uid = useId();
  const [value, setValue] = useState(50);

  return (
    <figure className="ba" style={{ '--ratio': ratio } as React.CSSProperties}>
      <div className="ba__stage">
        {/* Alsó réteg: az utána állapot, teljes szélességben. */}
        <img className="ba__img" src={afterSrc} alt={afterAlt} loading="lazy" decoding="async" />

        {/*
          Felső réteg: az előtte állapot. A levágás `clip-path`-tal történik,
          nem szélességgel — így a kép sosem torzul, csak a látható része
          változik, és a böngésző csak újrafestést végez, nem újratördelést.
        */}
        <div className="ba__clip" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <img className="ba__img" src={beforeSrc} alt={beforeAlt} loading="lazy" decoding="async" />
        </div>

        <div className="ba__handle" style={{ left: `${value}%` }} aria-hidden="true">
          <span className="ba__handle-grip" />
        </div>

        <span className="ba__tag ba__tag--before" aria-hidden="true">
          Előtte
        </span>
        <span className="ba__tag ba__tag--after" aria-hidden="true">
          Utána
        </span>

        <label className="visually-hidden" htmlFor={`${uid}-range`}>
          Előtte-utána csúszka
        </label>
        <input
          id={`${uid}-range`}
          className="ba__range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          aria-valuetext={`${value}% látszik az előtte állapotból`}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
      <figcaption className="ba__caption">
        Húzd a csúszkát az előtte és utána állapot összehasonlításához.
      </figcaption>
    </figure>
  );
}
