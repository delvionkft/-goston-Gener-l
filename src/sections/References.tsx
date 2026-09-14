import { useState } from 'react';
import { ANCHOR, references } from '../config/site';
import { track } from '../lib/analytics';
import { useReveal } from '../hooks/useReveal';
import { ImageSlot } from '../components/ImageSlot';
import { Lightbox, type LightboxItem } from '../components/Lightbox';
import { PH } from '../components/PlaceholderText';
import { SectionMark } from '../components/SectionMark';
import { ExpandIcon } from '../components/Icons';
import './References.css';

/**
 * Referenciagaléria.
 *
 * Csak a fotók, képaláírás nélkül — a munka minőségét maga a kép mutatja
 * meg. A képre kattintva nagy nézet nyílik, ott is lapozható a galéria.
 */
export function References() {
  const headRef = useReveal<HTMLDivElement>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gallery: LightboxItem[] = references.items.map((item) => ({
    id: item.id,
    image: item.image,
    imageAlt: item.alt,
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    track('reference_open', { id: references.items[index].id, index: index + 1 });
  };

  return (
    <section className="section refs" id={ANCHOR.references} aria-labelledby="refs-cim">
      <SectionMark id={ANCHOR.references} />

      <div className="container">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">{references.eyebrow}</p>
          <h2 id="refs-cim">{references.title}</h2>
          <p className="section-lead">
            <PH value={references.lead} />
          </p>
        </div>

        <ul className="refs__grid">
          {references.items.map((item, index) => (
            <li className="refs__item card" key={item.id}>
              <button
                type="button"
                className="refs__zoom"
                onClick={() => openLightbox(index)}
                aria-haspopup="dialog"
              >
                <ImageSlot
                  src={item.image || undefined}
                  alt={item.alt}
                  ratio="4 / 3"
                  label="[REFERENCIAKÉP]"
                  sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
                />
                <span className="refs__expand" aria-hidden="true">
                  <ExpandIcon />
                </span>
                <span className="visually-hidden">Nagy nézet megnyitása</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          items={gallery}
          index={lightboxIndex}
          onIndexChange={(next) => {
            setLightboxIndex(next);
            track('reference_open', { id: gallery[next].id, index: next + 1, via: 'lightbox_nav' });
          }}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  );
}
