import { useEffect, useRef } from 'react';

/**
 * Kurzorkövető fényfolt kártyákon.
 *
 * Egyetlen figyelő ül a konténeren (event delegation), nem kártyánként
 * egy — tíz kártyánál ez tíz helyett egy listener. A pozíciót
 * CSS-változóba írjuk, tehát nincs újrarenderelés, és a böngésző csak
 * újrafest.
 *
 * Érintőképernyőn és csökkentett mozgás esetén nem kapcsol be: ott nincs
 * kurzor, amit követni lehetne.
 */
export function useSpotlight<T extends HTMLElement>(selector: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof matchMedia === 'undefined') return;
    if (matchMedia('(pointer: coarse)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (event: PointerEvent) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>(selector);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };

    root.addEventListener('pointermove', onMove);
    return () => root.removeEventListener('pointermove', onMove);
  }, [selector]);

  return ref;
}
