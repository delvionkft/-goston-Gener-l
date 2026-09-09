import { useId, useRef, useState } from 'react';
import { ANCHOR, solution } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { useReveal } from '../hooks/useReveal';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon, CheckIcon } from '../components/Icons';
import './Solution.css';

/**
 * Szolgáltatásbemutató váltakozó kép–szöveg elrendezéssel, fülekkel.
 * Nem ikonkártya-rács: minden fül egy nagyobb, önálló bemutató blokk.
 */
export function Solution() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const headRef = useReveal<HTMLDivElement>();
  const bodyRef = useReveal<HTMLDivElement>();

  const tabId = (i: number) => `${uid}-stab-${i}`;
  const panelId = (i: number) => `${uid}-spanel-${i}`;

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = solution.tabs.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = active === last ? 0 : active + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = active === 0 ? last : active - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(tabId(next))}`)?.focus();
  };

  return (
    <section className="section solution" id={ANCHOR.solution} aria-labelledby="solution-cim">
      <div className="container">
        <div className="solution__head" ref={headRef}>
          <p className="eyebrow">{solution.eyebrow}</p>
          <h2 id="solution-cim" className="solution__title">
            <PH value={solution.title} />
          </h2>
          <div className="solution__intro">
            <p className="section-lead">
              <PH value={solution.lead} />
            </p>
            <p className="solution__body">
              <PH value={solution.body} />
            </p>
          </div>
        </div>

        <div className="solution__wrap" ref={bodyRef}>
          <div
            className="solution__tabs"
            role="tablist"
            aria-label="Szolgáltatásaink"
            ref={listRef}
            onKeyDown={onKeyDown}
          >
            {solution.tabs.map((tab, index) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={tabId(index)}
                aria-selected={active === index}
                aria-controls={panelId(index)}
                tabIndex={active === index ? 0 : -1}
                className={`solution__tab ${active === index ? 'is-active' : ''}`}
                onClick={() => setActive(index)}
              >
                <PH value={tab.label} />
              </button>
            ))}
          </div>

          {solution.tabs.map((tab, index) => (
            <div
              key={tab.key}
              role="tabpanel"
              id={panelId(index)}
              aria-labelledby={tabId(index)}
              hidden={active !== index}
              tabIndex={0}
              className={`solution__panel ${index % 2 === 1 ? 'is-reversed' : ''}`}
            >
              {active === index ? (
                <>
                  <div className="solution__panel-copy">
                    <h3 className="solution__panel-title">
                      <PH value={tab.title} />
                    </h3>
                    <p className="solution__panel-body">
                      <PH value={tab.body} />
                    </p>
                    <ul className="solution__bullets">
                      {tab.bullets.map((bullet, i) => (
                        <li key={`${tab.key}-${i}`}>
                          <span className="solution__bullet-icon" aria-hidden="true">
                            <CheckIcon />
                          </span>
                          <PH value={bullet} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="solution__panel-media">
                    <ImageSlot
                      src={tab.image || undefined}
                      alt={tab.imageAlt}
                      ratio="5 / 4"
                      label="[SZOLGÁLTATÁS KÉP]"
                      sizes="(min-width: 900px) 46vw, 100vw"
                    />
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>

        <div className="solution__cta">
          <p className="solution__cta-text">
            Nem vagy biztos benne, melyik kell? Írd le a helyzetet, és megmondjuk.
          </p>
          <Button
            size="lg"
            icon={<ArrowDownIcon />}
            onClick={() => {
              track('cta_quote_click', {
                placement: 'szolgaltatas',
                context: solution.tabs[active].key,
              });
              scrollToId(ANCHOR.finalForm);
            }}
          >
            {solution.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
