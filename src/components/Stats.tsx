import { useEffect, useRef, useState } from 'react';
import { stats } from '../config/site';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import './Stats.css';

/**
 * Rövid számsáv a hero alatt.
 *
 * A számok görgetéskor egyszer felfutnak — ez az a fajta mozgás, ami
 * könnyeddé teszi az oldalt anélkül, hogy eltakarná a tartalmat.
 * Csökkentett mozgás esetén rögtön a végértéket mutatja.
 */
export function Stats() {
  const ref = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();
  const [animated, setAnimated] = useState(0);

  /* Csökkentett mozgásnál vagy IntersectionObserver nélkül nincs felfutás:
     a végérték jelenik meg. Ezt renderelés közben döntjük el, nem
     állapotírással — így nincs fölösleges újrarenderelés. */
  const supported = typeof IntersectionObserver !== 'undefined';
  const progress = reduced || !supported ? 1 : animated;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        obs.disconnect();

        const start = performance.now();
        const duration = 1100;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          /* easeOutCubic: gyorsan indul, lágyan áll meg. */
          setAnimated(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <ul className="stats" ref={ref}>
      {stats.map((item) => (
        <li className="stats__item" key={item.label}>
          <span className="stats__value">
            {Math.round(item.value * progress)}
            <span className="stats__suffix">{item.suffix}</span>
          </span>
          <span className="stats__label">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
