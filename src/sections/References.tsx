import { useCallback, useEffect, useRef, useState } from 'react';
import { ANCHOR, references } from '../config/site';
import { track } from '../lib/analytics';
import { useReveal } from '../hooks/useReveal';
import { ImageSlot } from '../components/ImageSlot';
import { PH } from '../components/PlaceholderText';
import { Lightbox } from '../components/Lightbox';
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon, PinIcon } from '../components/Icons';
import './References.css';

/**
 * Referenciagaléria.
 *
 * A lapozás natív CSS scroll-snap-pel működik: mobilon ujjal húzva,
 * desktopon a nyílgombokkal vagy billentyűzettel. Nincs hozzá
 * carousel-könyvtár — így nulla extra JS és natív, akadó nélküli görgetés.
 */
export function References() {
  const trackRef = useRef<HTMLUListElement>(null);
  const headRef = useReveal<HTMLDivElement>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  /** A nyílgombok letiltása a görgetősáv két végén. */
  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);
    return () => {
      el.removeEventListener('scroll', syncArrows);
      window.removeEventListener('resize', syncArrows);
    };
  }, [syncArrows]);

  const page = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.refs__item');
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({
      left: step * direction,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    track('reference_open', {
      index,
      title: references.items[index].title,
    });
  };

  return (
    <section className="section refs" id={ANCHOR.references} aria-labelledby="refs-cim">
      <div className="container">
        <div className="refs__head" ref={headRef}>
          <div className="refs__head-copy">
            <p className="eyebrow">{references.eyebrow}</p>
            <h2 id="refs-cim">{references.title}</h2>
            <p className="section-lead">
              <PH value={references.lead} />
            </p>
          </div>

          <div className="refs__nav">
            <button
              type="button"
              className="refs__arrow"
              onClick={() => page(-1)}
              disabled={!canPrev}
            >
              <ChevronLeftIcon />
              <span className="visually-hidden">Előző referenciák</span>
            </button>
            <button
              type="button"
              className="refs__arrow"
              onClick={() => page(1)}
              disabled={!canNext}
            >
              <ChevronRightIcon />
              <span className="visually-hidden">Következő referenciák</span>
            </button>
          </div>
        </div>
      </div>

      {/* A sáv a konténeren túlnyúlik, hogy a képek a képernyő széléig érjenek */}
      <ul
        className="refs__track"
        ref={trackRef}
        aria-label="Referenciák — vízszintesen görgethető lista"
        tabIndex={0}
      >
        {references.items.map((item, index) => (
          <li className="refs__item" key={item.id}>
            <button
              type="button"
              className="refs__card"
              onClick={() => openLightbox(index)}
              aria-haspopup="dialog"
            >
              <span className="refs__media">
                <ImageSlot
                  src={item.image || undefined}
                  alt={item.imageAlt}
                  ratio="3 / 4"
                  label="[REFERENCIAKÉP]"
                  sizes="(min-width: 1100px) 30vw, (min-width: 640px) 44vw, 80vw"
                />
                <span className="refs__expand" aria-hidden="true">
                  <ExpandIcon />
                </span>
              </span>
              <span className="refs__meta">
                <span className="refs__title">
                  <PH value={item.title} />
                </span>
                <span className="refs__loc">
                  <PinIcon />
                  <PH value={item.location} />
                </span>
              </span>
              <span className="visually-hidden">— nagy nézet megnyitása</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="refs__hint container">
        Húzd oldalra, vagy kattints a képre a nagy nézethez.
      </p>

      {lightboxIndex !== null ? (
        <Lightbox
          items={references.items}
          index={lightboxIndex}
          onIndexChange={(next) => {
            setLightboxIndex(next);
            track('reference_open', {
              index: next,
              title: references.items[next].title,
              via: 'lightbox_nav',
            });
          }}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  );
}
