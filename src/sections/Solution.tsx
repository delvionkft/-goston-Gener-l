import { useId, useState } from 'react';
import { ANCHOR, activeServices, solution } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { useReveal } from '../hooks/useReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon, CheckIcon, PlusIcon } from '../components/Icons';
import './Solution.css';

/**
 * Szolgáltatások.
 *
 * Kártyarács, ahol minden kártya lenyitható (ARIA disclosure minta).
 * Nem carousel: a rács minden méreten kiszámíthatóan viselkedik, a
 * lenyitás pedig nem visz el másik nézetre — a látogató nem veszíti el
 * a helyét, és nem kell lapozgatnia, hogy összehasonlítson kettőt.
 */
export function Solution() {
  const uid = useId();
  const headRef = useReveal<HTMLDivElement>();
  const gridRef = useSpotlight<HTMLUListElement>('.svc__card');
  /* Alapból minden kártya csukva: így a rács egyenletes, és a látogató
     dönti el, mit nyit ki. */
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string, label: string) => {
    setOpen((prev) => {
      const next = prev === key ? null : key;
      if (next) track('service_open', { service: label });
      return next;
    });
  };

  return (
    <section className="section solution" id={ANCHOR.solution} aria-labelledby="solution-cim">
      <div className="container">
        <div className="solution__head" ref={headRef}>
          <p className="eyebrow">{solution.eyebrow}</p>
          <h2 id="solution-cim">{solution.title}</h2>
          <p className="section-lead">{solution.lead}</p>
        </div>

        <ul className="solution__grid" ref={gridRef}>
          {activeServices.map((service) => {
            const panelId = `${uid}-${service.key}`;
            const isOpen = open === service.key;

            return (
              <li key={service.key} className={`svc ${isOpen ? 'is-open' : ''}`}>
                <article className="svc__card">
                  <div className="svc__media">
                    <ImageSlot
                      src={service.image || undefined}
                      alt={service.imageAlt}
                      ratio="5 / 3"
                      label="[SZOLGÁLTATÁS KÉP]"
                      sizes="(min-width: 1100px) 30vw, (min-width: 700px) 46vw, 92vw"
                    />
                  </div>

                  <div className="svc__body">
                    <h3 className="svc__title">{service.label}</h3>
                    <p className="svc__summary">{service.summary}</p>

                    <button
                      type="button"
                      className="svc__toggle"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(service.key, service.label)}
                    >
                      <span className="svc__toggle-icon" aria-hidden="true">
                        <PlusIcon />
                      </span>
                      <span>{isOpen ? 'Kevesebb részlet' : 'Részletek'}</span>
                    </button>

                    <div className="svc__detail" id={panelId} hidden={!isOpen}>
                      <dl className="svc__facts">
                        <div>
                          <dt>Kinek ajánljuk</dt>
                          <dd>{service.audience}</dd>
                        </div>
                        <div>
                          <dt>Mire ad megoldást</dt>
                          <dd>{service.solves}</dd>
                        </div>
                      </dl>

                      <p className="svc__options-label">Miből választhatsz</p>
                      <ul className="svc__options">
                        {service.options.map((option) => (
                          <li key={option}>
                            <span className="svc__check" aria-hidden="true">
                              <CheckIcon />
                            </span>
                            <PH value={option} />
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        className="svc__cta"
                        onClick={() => {
                          track('cta_quote_click', {
                            placement: 'szolgaltatas-kartya',
                            context: service.label,
                          });
                          scrollToId(ANCHOR.quickForm);
                        }}
                      >
                        Ajánlatot kérek erre
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="solution__cta">
          <p className="solution__cta-text">{solution.ctaText}</p>
          <Button
            size="lg"
            icon={<ArrowDownIcon />}
            onClick={() => {
              track('cta_quote_click', { placement: 'szolgaltatas-zaro' });
              scrollToId(ANCHOR.quickForm);
            }}
          >
            {solution.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
