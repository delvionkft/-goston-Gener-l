import { ANCHOR, containsPlaceholder, testimonials } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { PH } from '../components/PlaceholderText';
import { QuoteIcon } from '../components/Icons';
import './Testimonials.css';

/**
 * Ügyfélvélemények.
 *
 * A vélemények a konfigurációból jönnek, és amíg helyőrzők, az oldal
 * láthatóan jelzi, hogy mintatartalomról van szó. Kitalált vélemény
 * megtévesztő — és ha kiderül, pont a bizalmat rombolja le, amit
 * építeni akar.
 */
export function Testimonials() {
  const headRef = useReveal<HTMLDivElement>();
  const listRef = useReveal<HTMLUListElement>();

  const isSample = testimonials.items.some((item) => containsPlaceholder(item.quote));

  return (
    <section
      className="section testimonials"
      id={ANCHOR.testimonials}
      aria-labelledby="testimonials-cim"
    >
      <div className="container">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">{testimonials.eyebrow}</p>
          <h2 id="testimonials-cim">{testimonials.title}</h2>
          <p className="section-lead">{testimonials.lead}</p>
          {isSample ? (
            <p className="testimonials__notice ph">{testimonials.sampleNotice}</p>
          ) : null}
        </div>

        <ul className="testimonials__grid" ref={listRef}>
          {testimonials.items.map((item, index) => (
            <li
              className="testimonials__card card"
              key={item.id}
              style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
            >
              <figure className="testimonials__figure">
                <span className="testimonials__mark" aria-hidden="true">
                  <QuoteIcon />
                </span>
                <blockquote className="testimonials__quote">
                  <p>
                    <PH value={item.quote} />
                  </p>
                </blockquote>
                <figcaption className="testimonials__author">
                  <span className="testimonials__name">
                    <PH value={item.author} />
                  </span>
                  <span className="testimonials__meta">
                    <PH value={item.meta} />
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
