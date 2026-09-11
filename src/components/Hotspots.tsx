import { useEffect, useId, useRef, useState } from 'react';
import { PlusIcon } from './Icons';
import './Hotspots.css';

export interface Hotspot {
  /** Vízszintes helyzet a kép szélességének százalékában. */
  x: number;
  /** Függőleges helyzet a kép magasságának százalékában. */
  y: number;
  title: string;
  text: string;
}

interface Props {
  items: readonly Hotspot[];
  /** A jelöléscsoport összefoglaló neve a képernyőolvasónak. */
  label: string;
}

/**
 * Információs pontok a hero kép fölött.
 *
 * Valódi gombokból áll, nem hover-only rétegből: érintőképernyőn is
 * működik, és billentyűzettel is bejárható. Egyszerre egy pont nyitott.
 * A buborék tartalma mindig a DOM-ban van, csak `hidden` — így a
 * képernyőolvasó az `aria-controls` mentén megtalálja.
 */
export function Hotspots({ items, label }: Props) {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Kattintás a csoporton kívül, illetve Esc → bezárás. */
  useEffect(() => {
    if (open === null) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="hotspots" ref={rootRef} role="group" aria-label={label}>
      {items.map((item, index) => {
        const bubbleId = `${uid}-bubble-${index}`;
        const isOpen = open === index;
        return (
          <div
            key={item.title}
            className={`hotspot ${isOpen ? 'is-open' : ''}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            <button
              type="button"
              className="hotspot__dot"
              aria-expanded={isOpen}
              aria-controls={bubbleId}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className="hotspot__ring" aria-hidden="true" />
              <PlusIcon />
              <span className="visually-hidden">{item.title} — részletek</span>
            </button>

            <div className="hotspot__bubble" id={bubbleId} hidden={!isOpen}>
              <p className="hotspot__title">{item.title}</p>
              <p className="hotspot__text">{item.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
