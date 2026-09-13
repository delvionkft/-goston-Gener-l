import { ANCHOR, form as formCopy } from '../config/site';
import { QuoteForm } from '../components/QuoteForm';
import { PhoneLink } from '../components/ContactLinks';
import { useReveal } from '../hooks/useReveal';
import { CheckIcon } from '../components/Icons';
import './QuickQuote.css';

interface Props {
  onOpenPrivacy: () => void;
}

/**
 * Rövid ajánlatkérő közvetlenül a hero alatt.
 *
 * Ugyanaz a kérdőív fut benne, mint a lap alján — aki már döntött, annak
 * ne kelljen végiggörgetnie az oldalt. A mérésben a `source` különbözteti
 * meg a kettőt (`hero-urlap` és `fo-urlap`), így látszik, melyik hoz
 * több érdeklődőt.
 */
export function QuickQuote({ onOpenPrivacy }: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section quick" id={ANCHOR.quickForm} aria-labelledby="quick-cim">
      <div className="container">
        <div className="quick__grid" ref={ref}>
          <div className="quick__copy">
            <p className="eyebrow">{formCopy.top.eyebrow}</p>
            <h2 id="quick-cim" className="quick__title">
              {formCopy.top.title}
            </h2>
            <p className="section-lead">{formCopy.top.lead}</p>

            <ul className="quick__points">
              {formCopy.top.points.map((point) => (
                <li key={point}>
                  <span className="quick__point-icon" aria-hidden="true">
                    <CheckIcon />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="quick__call">
              Inkább telefonálnál? <PhoneLink placement="urlap-fent" />
            </p>
          </div>

          <div className="quick__panel">
            <QuoteForm source="hero-urlap" onOpenPrivacy={onOpenPrivacy} />
          </div>
        </div>
      </div>
    </section>
  );
}
