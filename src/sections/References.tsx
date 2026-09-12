import { useState } from 'react';
import { ANCHOR, references } from '../config/site';
import { track } from '../lib/analytics';
import { useReveal } from '../hooks/useReveal';
import { BeforeAfter } from '../components/BeforeAfter';
import { ImageSlot } from '../components/ImageSlot';
import { Lightbox, type LightboxItem } from '../components/Lightbox';
import { PH } from '../components/PlaceholderText';
import { ExpandIcon, PinIcon } from '../components/Icons';
import './References.css';

/**
 * Referenciagaléria.
 *
 * Kártyánként két megjelenés lehetséges, attól függően, mi van kitöltve:
 *  - előtte és utána kép is van → összehasonlító csúszka,
 *  - csak utána kép van        → egyetlen kép, nagy nézettel.
 * Így ugyanaz a szekció működik akkor is, ha nincs minden munkáról
 * „előtte” fotó — és nem kell hozzá kitalált tartalom.
 */
export function References() {
  const headRef = useReveal<HTMLDivElement>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* A nagy nézet csak a valós képekkel dolgozik. */
  const gallery: LightboxItem[] = references.items
    .filter((item) => item.afterImage)
    .map((item) => ({
      id: item.id,
      title: item.workType,
      location: item.location,
      description: item.result,
      image: item.afterImage,
      imageAlt: item.afterAlt,
    }));

  const openLightbox = (id: string) => {
    const index = gallery.findIndex((entry) => entry.id === id);
    if (index < 0) return;
    setLightboxIndex(index);
    track('reference_open', { id, title: gallery[index].title });
  };

  return (
    <section className="section refs" id={ANCHOR.references} aria-labelledby="refs-cim">
      <div className="container">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">{references.eyebrow}</p>
          <h2 id="refs-cim">{references.title}</h2>
          <p className="section-lead">
            <PH value={references.lead} />
          </p>
        </div>

        <ul className="refs__grid">
          {references.items.map((item) => {
            const hasPair = Boolean(item.beforeImage && item.afterImage);

            return (
              <li className="refs__item card" key={item.id}>
                <div className="refs__media">
                  {hasPair ? (
                    <BeforeAfter
                      beforeSrc={item.beforeImage}
                      beforeAlt={item.beforeAlt}
                      afterSrc={item.afterImage}
                      afterAlt={item.afterAlt}
                      beforeLabel={references.beforeLabel}
                      afterLabel={references.afterLabel}
                      ratio="4 / 3"
                      sizes="(min-width: 700px) 50vw, 100vw"
                    />
                  ) : item.afterImage ? (
                    <button
                      type="button"
                      className="refs__zoom"
                      onClick={() => openLightbox(item.id)}
                      aria-haspopup="dialog"
                    >
                      <ImageSlot
                        src={item.afterImage}
                        alt={item.afterAlt}
                        ratio="4 / 3"
                        sizes="(min-width: 700px) 50vw, 100vw"
                      />
                      <span className="refs__expand" aria-hidden="true">
                        <ExpandIcon />
                      </span>
                      <span className="visually-hidden">Nagy nézet megnyitása</span>
                    </button>
                  ) : (
                    <ImageSlot
                      src={undefined}
                      alt={item.afterAlt}
                      ratio="4 / 3"
                      label="[REFERENCIAKÉP]"
                    />
                  )}
                </div>

                <div className="refs__body">
                  <p className="refs__loc">
                    <PinIcon />
                    <PH value={item.location} />
                  </p>
                  <h3 className="refs__type">
                    <PH value={item.workType} />
                  </h3>
                  <p className="refs__result">
                    <PH value={item.result} />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {gallery.length > 0 ? (
          <p className="refs__hint">
            Ahol előtte–utána kép is van, a csúszkát húzva hasonlíthatod össze a két
            állapotot.
          </p>
        ) : null}
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          items={gallery}
          index={lightboxIndex}
          onIndexChange={(next) => {
            setLightboxIndex(next);
            track('reference_open', {
              id: gallery[next].id,
              title: gallery[next].title,
              via: 'lightbox_nav',
            });
          }}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  );
}
