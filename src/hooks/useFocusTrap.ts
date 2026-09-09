import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Fókuszcsapda modális felületekhez (mobilmenü, lightbox, jogi ablak).
 *
 * - Megnyitáskor a fókusz a konténer első fókuszálható elemére kerül.
 * - A Tab és Shift+Tab körbeér a konténeren belül.
 * - Bezáráskor a fókusz visszakerül oda, ahonnan indult.
 * - Esc lenyomására meghívja az `onClose` függvényt.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onClose: () => void,
): void {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const items = container.querySelectorAll<HTMLElement>(FOCUSABLE);
      (items[0] ?? container).focus({ preventScroll: true });
    };
    // A megnyitási animáció után fókuszálunk, hogy ne ugorjon a nézet.
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.body.classList.add('is-locked');

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.classList.remove('is-locked');
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [ref, active, onClose]);
}
