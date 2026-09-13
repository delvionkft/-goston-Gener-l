import { ANCHOR, cta, faq } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToNearestForm } from '../lib/scroll';
import { useReveal } from '../hooks/useReveal';
import { Button } from '../components/Button';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon, ChevronDownIcon } from '../components/Icons';
import { SectionMark } from '../components/SectionMark';
import './Faq.css';

/**
 * Gyakori kérdések.
 *
 * Natív `<details>` elemekkel: billentyűzettel és képernyőolvasóval
 * működik külön kód nélkül, a válaszok pedig a DOM-ban vannak akkor is,
 * amikor össze vannak csukva — a keresők így olvassák őket.
 */
export function Faq() {
  const headRef = useReveal<HTMLDivElement>();
  const listRef = useReveal<HTMLDivElement>();

  return (
    <section className="section section--soft faq" id={ANCHOR.faq} aria-labelledby="faq-cim">
      <SectionMark id={ANCHOR.faq} />
      <div className="container faq__inner">
        <div className="faq__head" ref={headRef}>
          <p className="eyebrow">{faq.eyebrow}</p>
          <h2 id="faq-cim">{faq.title}</h2>
          <p className="section-lead">{faq.lead}</p>
        </div>

        <div className="faq__list" ref={listRef}>
          {faq.items.map((item) => (
            <details
              className="faq__item"
              key={item.q}
              onToggle={(event) => {
                if ((event.currentTarget as HTMLDetailsElement).open) {
                  track('faq_open', { question: item.q });
                }
              }}
            >
              <summary className="faq__q">
                <span>{item.q}</span>
                <span className="faq__chevron" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </summary>
              <div className="faq__a">
                <p>
                  <PH value={item.a} />
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="faq__cta">
          <p className="faq__cta-text">
            Nem találtad meg a választ? Írd meg az ajánlatkérésben, és a
            visszahíváskor átbeszéljük.
          </p>
          <Button
            size="lg"
            icon={<ArrowDownIcon />}
            onClick={() => {
              track('cta_quote_click', { placement: 'gyik' });
              scrollToNearestForm([ANCHOR.quickForm, ANCHOR.form]);
            }}
          >
            {cta.primary}
          </Button>
        </div>
      </div>
    </section>
  );
}
