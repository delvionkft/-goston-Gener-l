import { useEffect, useRef } from 'react';
import './Wordmark.css';

interface Props {
  text: string;
}

/**
 * Nagyméretű, halvány cégnév a footer háttereként.
 *
 * A méretet nem fix `font-size` adja: a szöveg természetes szélességét
 * megmérjük, és pontosan akkorára kicsinyítjük, hogy kiférjen. Egy fix
 * `clamp(…, 20vw, …)` érték hosszú névnél („Ágoston-Generál") két-három
 * képernyőnyi széles lenne, és a felirat eleje-vége levágódna.
 *
 * Újramérünk átméretezéskor és a betűtípus betöltése után is — a
 * tartalék betűtípus más szélességű, mint a Montserrat, így a betöltés
 * pillanatában a méret elcsúszna.
 */
export function Wordmark({ text }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) return;

    let frame = 0;

    const fit = () => {
      frame = 0;
      /*
       * `offsetWidth`, nem `getBoundingClientRect()`: az utóbbi a
       * TRANSZFORMÁLT szélességet adja vissza, tehát a saját már
       * alkalmazott kicsinyítésünket mérnénk újra, és a méretarány
       * körbeérne. Az offsetWidth az elrendezési szélesség, amire a
       * transform nincs hatással.
       */
      const natural = el.offsetWidth;
      // Egy kevés levegő a két szélén, hogy ne érjen a képernyő pereméig.
      const available = box.clientWidth * 0.96;
      if (natural <= 0 || available <= 0) return;
      el.style.setProperty('--fit', Math.min(1, available / natural).toFixed(4));
    };

    const schedule = () => {
      frame ||= requestAnimationFrame(fit);
    };

    fit();
    window.addEventListener('resize', schedule);

    // A betűtípus betöltése után a szöveg szélessége megváltozik.
    document.fonts?.ready.then(fit).catch(() => {});

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    observer?.observe(box);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [text]);

  return (
    <div className="wordmark" ref={boxRef} aria-hidden="true">
      <span className="wordmark__text" ref={textRef}>
        {text}
      </span>
    </div>
  );
}
