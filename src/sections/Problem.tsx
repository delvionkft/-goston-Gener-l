import { useId, useRef, useState } from 'react';
import { ANCHOR, cta, problem } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { useReveal } from '../hooks/useReveal';
import { Button } from '../components/Button';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon } from '../components/Icons';
import './Problem.css';

/**
 * Fájdalompont-szekció interaktív problémaválasztóval.
 * Desktopon fülekként, mobilon harmonikaként viselkedik — mindkét
 * esetben ugyanaz a DOM és ugyanaz az ARIA-szerep (tablist), így
 * a billentyűzetes navigáció egységes.
 */
export function Problem() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal<HTMLDivElement>();

  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = (i: number) => `${uid}-panel-${i}`;

  /** Nyílbillentyűs navigáció a fülek között — WAI-ARIA tabs minta. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = problem.items.length - 1;
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

  const current = problem.items[active];

  return (
    <section className="section problem" id={ANCHOR.problem} aria-labelledby="problem-cim">
      <div className="container">
        <div className="problem__head" ref={revealRef}>
          <p className="eyebrow">{problem.eyebrow}</p>
          <h2 id="problem-cim">{problem.title}</h2>
          <p className="section-lead">{problem.lead}</p>
        </div>

        <div className="problem__body">
          <div
            className="problem__tabs"
            role="tablist"
            aria-label="Gyakori problémák"
            aria-orientation="vertical"
            ref={listRef}
            onKeyDown={onKeyDown}
          >
            {problem.items.map((item, index) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                id={tabId(index)}
                aria-selected={active === index}
                aria-controls={panelId(index)}
                tabIndex={active === index ? 0 : -1}
                className={`problem__tab ${active === index ? 'is-active' : ''}`}
                onClick={() => setActive(index)}
              >
                <span className="problem__tab-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="problem__tab-label">
                  <PH value={item.label} />
                </span>
              </button>
            ))}
          </div>

          {problem.items.map((item, index) => (
            <div
              key={item.key}
              role="tabpanel"
              id={panelId(index)}
              aria-labelledby={tabId(index)}
              hidden={active !== index}
              tabIndex={0}
              className="problem__panel"
            >
              {active === index ? (
                <>
                  <h3 className="problem__panel-title">
                    <PH value={item.title} />
                  </h3>
                  <p className="problem__panel-body">
                    <PH value={item.body} />
                  </p>
                </>
              ) : null}
            </div>
          ))}
        </div>

        <div className="problem__bridge">
          <p className="problem__bridge-text">{problem.bridge}</p>
          <Button
            size="lg"
            icon={<ArrowDownIcon />}
            onClick={() => {
              track('cta_quote_click', { placement: 'problema', context: current.key });
              scrollToId(ANCHOR.form);
            }}
          >
            {cta.primary}
          </Button>
        </div>
      </div>
    </section>
  );
}
