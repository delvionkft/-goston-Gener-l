import { useEffect, useRef } from 'react';
import './ScrollProgress.css';

/**
 * Olvasási előrehaladás sávja az oldal tetején.
 *
 * Közvetlenül a DOM-ra ír egy CSS-változót, nem React-állapotra — így a
 * görgetés nem indít újrarenderelést. A számolás rAF-ben fut, tehát
 * képkockánként legfeljebb egyszer.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty('--scrolled', ratio.toFixed(4));
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return <div className="scrollprog" ref={ref} aria-hidden="true" />;
}
