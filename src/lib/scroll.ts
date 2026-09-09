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
