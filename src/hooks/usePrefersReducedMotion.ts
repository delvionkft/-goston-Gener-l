import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Igaz, ha a látogató csökkentett mozgást kért az operációs rendszerében.
 * A JS-vezérelt animációkat (parallax, kurzorfény) ez alapján kapcsoljuk ki.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof matchMedia === 'undefined' ? true : matchMedia(QUERY).matches,
  );

  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mql = matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
