import { useEffect, useRef } from 'react';

/**
 * Egyszeri megjelenési animáció görgetéskor. Egyetlen megosztott
 * IntersectionObserver figyeli az összes elemet, így sok szekciónál
 * sem terheli a fő szálat.
 *
 * A `prefers-reduced-motion` beállítást tiszteletben tartja: ilyenkor
 * az elem azonnal láthatóvá válik, animáció nélkül.
 */

type Target = Element;

let observer: IntersectionObserver | null = null;
const registry = new WeakSet<Target>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  observer ??= new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
        registry.delete(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );
  return observer;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    const obs = getObserver();
    if (reduced || !obs) {
      el.classList.add('is-visible');
      return;
    }

    el.classList.add('reveal');
    registry.add(el);
    obs.observe(el);

    return () => {
      obs.unobserve(el);
      registry.delete(el);
    };
  }, []);

  return ref;
}
