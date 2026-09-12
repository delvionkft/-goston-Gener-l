import { ANCHOR, company, form as formCopy } from '../config/site';
import { QuoteForm } from '../components/QuoteForm';
import { EmailLink, PhoneLink } from '../components/ContactLinks';
import { PH } from '../components/PlaceholderText';
import { useReveal } from '../hooks/useReveal';
import { CheckIcon } from '../components/Icons';
import { SectionMark } from '../components/SectionMark';
import './QuoteSection.css';

interface Props {
  onOpenPrivacy: () => void;
}

/**
 * Az oldal konverziós pontja: az ajánlatkérő űrlap.
 *
 * Az űrlap mellett ott van, hogy mi történik a beküldés után — ez a
 * leggyakoribb belső kifogást oldja fel („mi lesz, ha megadom a számom?”).
 */
export function QuoteSection({ onOpenPrivacy }: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      className="section section--dark quote on-dark"
      id={ANCHOR.form}
      aria-labelledby="quote-cim"
    >
      <SectionMark id={ANCHOR.form} />
      <div className="quote__glow" aria-hidden="true" />

      <div className="container">
        <div className="quote__grid" ref={ref}>
          <div className="quote__copy">
            <p className="eyebrow">{formCopy.eyebrow}</p>
            <h2 id="quote-cim" className="quote__title">
              {formCopy.title}
            </h2>
            <p className="section-lead">{formCopy.lead}</p>

            <div className="quote__after">
              <h3 className="quote__after-title">Mi történik a beküldés után?</h3>
              <ol className="quote__steps">
                {formCopy.afterSubmit.map((step, index) => (
                  <li key={step}>
                    <span className="quote__step-num" aria-hidden="true">
                      {index === formCopy.afterSubmit.length - 1 ? <CheckIcon /> : index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <dl className="quote__contacts">
              <div>
                <dt>Telefon</dt>
                <dd>
                  <PhoneLink placement="urlap-szekcio" />
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>
                  <EmailLink placement="urlap-szekcio" />
                </dd>
              </div>
              <div>
                <dt>Működési terület</dt>
                <dd className="quote__area">
                  <PH value={company.serviceArea} />
                </dd>
              </div>
            </dl>
          </div>

          {/* Világos panel a sötét háttéren — az űrlap így a szekció
              legerősebb vizuális eleme. */}
          <div className="quote__panel">
            <QuoteForm source="fo-urlap" onOpenPrivacy={onOpenPrivacy} />
          </div>
        </div>
      </div>
    </section>
  );
}
