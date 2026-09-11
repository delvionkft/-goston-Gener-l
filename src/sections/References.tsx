import { useMemo, useState } from 'react';
import { ANCHOR, activeServices, references, testimonials, type ReferenceItem } from '../config/site';
import { track } from '../lib/analytics';
import { useReveal } from '../hooks/useReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { ImageSlot } from '../components/ImageSlot';
import { PH } from '../components/PlaceholderText';
import { Lightbox } from '../components/Lightbox';
import { ExpandIcon, PinIcon } from '../components/Icons';
import './References.css';

const ALL = 'mind';

/**
 * Referenciagaléria szűréssel és lapozással.
 *
 * A szűrő kizárólag a ténylegesen szereplő kategóriákból épül fel —
 * nincs olyan szűrőgomb, ami üres találatra vezet. A lapozás
 * „továbbiak” gombbal működik: a már megnézett elemek a képernyőn
 * maradnak, így a látogató nem veszíti el a helyét.
 */
export function References() {
  const headRef = useReveal<HTMLDivElement>();
  const gridRef = useSpotlight<HTMLUListElement>('.refs__card');
  const [filter, setFilter] = useState<string>(ALL);
  const [visible, setVisible] = useState<number>(references.pageSize);
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  /** Csak azok a kategóriák, amelyekhez tényleg tartozik referencia. */
  const categories = useMemo(() => {
    const used = new Set(references.items.map((item) => item.category));
    return activeServices
      .filter((service) => used.has(service.key))
      .map((service) => ({ key: service.key, label: service.label }));
  }, []);

  const filtered = useMemo<readonly ReferenceItem[]>(
    () =>
      filter === ALL
        ? references.items
        : references.items.filter((item) => item.category === filter),
    [filter],
  );

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > shown.length;

  const changeFilter = (key: string, label: string) => {
    setFilter(key);
    setVisible(references.pageSize);
    track('reference_filter', { filter: label });
  };

  /* A nagy nézet a szűrt listán lapoz, nem a teljesen — így nem ugrik
     át olyan elemre, ami a szűrő szerint nem is látszik. */
  const lightboxIndex = lightboxId ? filtered.findIndex((item) => item.id === lightboxId) : -1;

  const openLightbox = (item: ReferenceItem) => {
    setLightboxId(item.id);
    track('reference_open', { reference: item.title, filter });
  };

  return (
    <section className="section refs" id={ANCHOR.references} aria-labelledby="refs-cim">
      <div className="container">
        <div className="refs__head" ref={headRef}>
          <p className="eyebrow">{references.eyebrow}</p>
          <h2 id="refs-cim">{references.title}</h2>
          <p className="section-lead">{references.lead}</p>
        </div>

        {categories.length > 1 ? (
          <div className="refs__filters" role="group" aria-label="Referenciák szűrése munkatípus szerint">
            <button
              type="button"
              className={`refs__filter ${filter === ALL ? 'is-active' : ''}`}
              aria-pressed={filter === ALL}
              onClick={() => changeFilter(ALL, 'Mind')}
            >
              Mind
              <span className="refs__filter-count">{references.items.length}</span>
            </button>

            {categories.map((category) => {
              const count = references.items.filter(
                (item) => item.category === category.key,
              ).length;
              return (
                <button
                  key={category.key}
                  type="button"
                  className={`refs__filter ${filter === category.key ? 'is-active' : ''}`}
                  aria-pressed={filter === category.key}
                  onClick={() => changeFilter(category.key, category.label)}
                >
                  {category.label}
                  <span className="refs__filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <ul className="refs__grid" ref={gridRef}>
          {shown.map((item) => (
            <li key={item.id} className="refs__item">
              <button
                type="button"
                className="refs__card"
                onClick={() => openLightbox(item)}
                aria-haspopup="dialog"
              >
                <span className="refs__media">
                  <ImageSlot
                    src={item.image || item.afterImage || undefined}
                    alt={item.imageAlt}
                    ratio="4 / 3"
                    label="[REFERENCIAKÉP]"
                    sizes="(min-width: 1100px) 30vw, (min-width: 700px) 46vw, 92vw"
                  />
                  <span className="refs__expand" aria-hidden="true">
                    <ExpandIcon />
                  </span>
                  {item.beforeImage && item.afterImage ? (
                    <span className="refs__badge">Előtte–utána</span>
                  ) : null}
                </span>

                <span className="refs__meta">
                  <span className="refs__title">
                    <PH value={item.title} />
                  </span>
                  <span className="refs__loc">
                    <PinIcon />
                    <PH value={item.location} />
                  </span>
                  <span className="refs__work">
                    <PH value={item.work} />
                  </span>
                </span>
                <span className="visually-hidden">— nagy nézet megnyitása</span>
              </button>
            </li>
          ))}
        </ul>

        {filtered.length === 0 ? (
          <p className="refs__empty">Ehhez a szűrőhöz még nincs feltöltött munka.</p>
        ) : null}

        {hasMore ? (
          <div className="refs__more">
            <button
              type="button"
              className="refs__more-btn"
              onClick={() => setVisible((prev) => prev + references.pageSize)}
            >
              További munkák
              <span className="refs__more-count">
                {shown.length} / {filtered.length}
              </span>
            </button>
          </div>
        ) : null}

        {testimonials.length > 0 ? (
          <div className="refs__quotes">
            <h3 className="refs__quotes-title">Amit az ügyfeleink mondtak</h3>
            <ul className="refs__quote-list">
              {testimonials.map((quote) => (
                <li key={quote.name} className="refs__quote">
                  <blockquote>{quote.text}</blockquote>
                  <p className="refs__quote-by">
                    {quote.name}
                    {quote.location ? ` — ${quote.location}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {lightboxIndex >= 0 ? (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onIndexChange={(next) => {
            setLightboxId(filtered[next].id);
            track('reference_open', { reference: filtered[next].title, via: 'lightbox_nav' });
          }}
          onClose={() => setLightboxId(null)}
        />
      ) : null}
    </section>
  );
}
