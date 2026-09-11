import { activeServices } from '../config/site';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import './Marquee.css';

/**
 * Végtelenített futószalag a szolgáltatásokból.
 *
 * A hero és az ajánlatkérő közé kerül: egyetlen pillantásra megmutatja a
 * kínálat szélességét, és mozgást visz az oldal tetejére.
 *
 * A lista kétszer szerepel a DOM-ban, mert a végtelenített görgetéshez
 * kell a másolat. A második példány `aria-hidden`, hogy a képernyőolvasó
 * ne mondja fel kétszer. Csökkentett mozgás esetén nem animálunk:
 * ilyenkor egyszerű, oldalra görgethető sáv marad.
 */
export function Marquee() {
  const reduced = usePrefersReducedMotion();
  const items = activeServices.map((service) => service.label);

  return (
    <div className={`marquee ${reduced ? 'is-static' : ''}`}>
      <div className="marquee__track">
        <ul className="marquee__list">
          {items.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        {!reduced ? (
          <ul className="marquee__list" aria-hidden="true">
            {items.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
