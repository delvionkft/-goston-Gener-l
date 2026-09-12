import { useEffect, useState } from 'react';

/**
 * Megmondja, melyik szekció van éppen a nézetben.
 *
 * Egyetlen IntersectionObserver figyeli az összes szekciót — nincs
 * görgetésre kötött számolás, így a fő szál nem terhelődik. A képernyő
 * közepére szűkített sáv miatt mindig az van kijelölve, amit a látogató
 * ténylegesen olvas.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
