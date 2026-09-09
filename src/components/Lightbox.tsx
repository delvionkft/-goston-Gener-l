import { useCallback, useEffect, useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { ImageSlot } from './ImageSlot';
import { PH } from './PlaceholderText';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, PinIcon } from './Icons';
import './Lightbox.css';

export interface LightboxItem {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface Props {
  items: readonly LightboxItem[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}

/**
 * Nagyított referencianézet.
 *
 * - Modális dialógus fókuszcsapdával, Esc-cel zárható.
 * - Balra/jobbra nyíllal és érintéssel (swipe) is lapozható.
 * - A háttér görgetése zárolva van, amíg nyitva van.
 */
export function Lightbox({ items, index, onIndexChange, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useFocusTrap(dialogRef, true, onClose);

  const go = useCallback(
    (direction: 1 | -1) => {
      const next = (index + direction + items.length) % items.length;
      onIndexChange(next);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go]);

  /** Érintéses lapozás. Csak akkor vált, ha egyértelműen vízszintes a mozdulat. */
  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    go(dx < 0 ? 1 : -1);
  };

  const item = items[index];

  return (
    <div className="lightbox" role="presentation">
      <div className="lightbox__backdrop" onClick={onClose} aria-hidden="true" />

      <div
        className="lightbox__dialog on-dark"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Referencia ${index + 1} / ${items.length}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button type="button" className="lightbox__close" onClick={onClose}>
          <CloseIcon />
          <span className="visually-hidden">Bezárás</span>
        </button>

        <div className="lightbox__stage">
          <ImageSlot
            src={item.image || undefined}
            alt={item.imageAlt}
            ratio="4 / 3"
            label="[REFERENCIAKÉP]"
            priority
            className="lightbox__image"
          />
        </div>

        <div className="lightbox__info">
          <p className="lightbox__count" aria-hidden="true">
            {index + 1} / {items.length}
          </p>
          <h3 className="lightbox__title">
            <PH value={item.title} />
          </h3>
          <p className="lightbox__loc">
            <PinIcon />
            <PH value={item.location} />
          </p>
          <p className="lightbox__desc">
            <PH value={item.description} />
          </p>
        </div>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              className="lightbox__arrow lightbox__arrow--prev"
              onClick={() => go(-1)}
            >
              <ChevronLeftIcon />
              <span className="visually-hidden">Előző referencia</span>
            </button>
            <button
              type="button"
              className="lightbox__arrow lightbox__arrow--next"
              onClick={() => go(1)}
            >
              <ChevronRightIcon />
              <span className="visually-hidden">Következő referencia</span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
