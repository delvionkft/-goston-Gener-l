import { ANCHOR, company, finalCta } from '../config/site';
import { QuoteForm } from '../components/QuoteForm';
import { EmailLink, PhoneLink } from '../components/ContactLinks';
import { PH } from '../components/PlaceholderText';
import { useReveal } from '../hooks/useReveal';
import './FinalCta.css';

interface Props {
  onOpenPrivacy: () => void;
}

/** A második, záró ajánlatkérési pont. Vizuálisan a legerősebb szekció. */
export function FinalCta({ onOpenPrivacy }: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      className="section section--dark final on-dark"
      id={ANCHOR.finalForm}
      aria-labelledby="final-cim"
    >
      <div className="final__glow" aria-hidden="true" />

      <div className="container">
        <div className="final__grid" ref={ref}>
          <div className="final__copy">
            <p className="eyebrow">{finalCta.eyebrow}</p>
            <h2 id="final-cim" className="final__title">
              {finalCta.title}
            </h2>
            <p className="section-lead">{finalCta.lead}</p>

            <dl className="final__contacts">
              <div>
                <dt>Telefon</dt>
                <dd>
                  <PhoneLink placement="urlap-also" />
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>
                  <EmailLink placement="urlap-also" />
                </dd>
              </div>
              <div>
                <dt>Szolgáltatási terület</dt>
                <dd className="final__area">
                  <PH value={company.serviceArea} />
                </dd>
              </div>
            </dl>
          </div>

          <div className="final__panel">
            <QuoteForm source="bottom" onDark onOpenPrivacy={onOpenPrivacy} />
          </div>
        </div>
      </div>
    </section>
  );
}
