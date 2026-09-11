import { ANCHOR, contact, form as formCopy, isFilled } from '../config/site';
import { QuoteForm } from '../components/QuoteForm';
import { EmailLink, PhoneLink } from '../components/ContactLinks';
import { useReveal } from '../hooks/useReveal';
import { hasSecondaryPhone } from '../lib/contact';
import { CheckIcon, ClockIcon } from '../components/Icons';
import './QuickQuote.css';

interface Props {
  onOpenPrivacy: () => void;
}

/** Az első ajánlatkérési pont, közvetlenül a hero után. */
export function QuickQuote({ onOpenPrivacy }: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section quick" id={ANCHOR.quickForm} aria-labelledby="quick-cim">
      <div className="container">
        <div className="quick__grid" ref={ref}>
          <div className="quick__aside">
            <p className="eyebrow">Ajánlatkérés</p>
            <h2 id="quick-cim">{formCopy.quick.title}</h2>
            <p className="section-lead">{formCopy.quick.lead}</p>

            <div className="quick__contacts">
              <PhoneLink placement="urlap-felso" />
              {hasSecondaryPhone() ? (
                <PhoneLink placement="urlap-felso" variant="secondary" />
              ) : null}
              <EmailLink placement="urlap-felso" />
              {/* Csak akkor jelenik meg, ha valós vállalás áll mögötte. */}
              {isFilled(contact.responseTime) ? (
                <p className="quick__response">
                  <ClockIcon />
                  <span>Válaszidő: {contact.responseTime}</span>
                </p>
              ) : null}
            </div>

            <div className="quick__after">
              <h3 className="quick__after-title">Mi történik a beküldés után?</h3>
              <ol className="quick__steps">
                {formCopy.afterSubmit.map((step, index) => (
                  <li key={step}>
                    <span className="quick__step-num" aria-hidden="true">
                      {index === formCopy.afterSubmit.length - 1 ? <CheckIcon /> : index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="quick__panel">
            <QuoteForm source="top" onOpenPrivacy={onOpenPrivacy} />
          </div>
        </div>
      </div>
    </section>
  );
}
