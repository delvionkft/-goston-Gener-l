/**
 * Sima görgetés egy szekcióhoz, a rögzített fejléc magasságát figyelembe véve.
 * A `prefers-reduced-motion` beállítás esetén azonnal ugrik.
 */
export function scrollToId(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  const reduced =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  target.scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  });

  // A billentyűzetes navigáció miatt a fókuszt is odavisszük.
  const restoreTabIndex = !target.hasAttribute('tabindex');
  if (restoreTabIndex) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  if (restoreTabIndex) {
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), {
      once: true,
    });
  }
}

/**
 * A két ajánlatkérő űrlap közül a közelebbihez görget.
 *
 * Két űrlap van az oldalon: egy a hero alatt, egy a lap alján. Ha egy
 * gomb mindig ugyanahhoz vinne, a látogató fele mindig a rossz irányba
 * ugrana — ezért a nézet közepéhez képest mérünk távolságot.
 *
 * A választott űrlap azonosítójával tér vissza, hogy a mérés is lássa,
 * melyikre vitt a gomb.
 */
export function scrollToNearestForm(ids: readonly string[]): string | undefined {
  const center = window.scrollY + window.innerHeight / 2;

  let bestId: string | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = Math.abs(top - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestId = id;
    }
  }

  if (bestId) scrollToId(bestId);
  return bestId;
}
