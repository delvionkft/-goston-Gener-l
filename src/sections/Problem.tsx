import { useId, useRef, useState } from 'react';
import { ANCHOR, problem } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { useReveal } from '../hooks/useReveal';
import { Button } from '../components/Button';
import { WindowFigure } from '../components/WindowFigure';
import { AlertIcon, ArrowDownIcon } from '../components/Icons';
import './Problem.css';

/**
 * Problémafelvetés.
 *
 * Két bemenet, egy állapot: az ablakrajz jelölései és a fülek ugyanazt a
 * kiválasztást állítják. A fülek adják az ARIA tab-mintát, a rajz jelölései
 * kiegészítő kapcsolók (`aria-pressed`) — így nincs két versengő tablist
 * ugyanarra a panelre.
 */
export function Problem() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal<HTMLDivElement>();

  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = (i: number) => `${uid}-panel-${i}`;
  const current = problem.items[active];

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

  const selectByKey = (key: string) => {
    const index = problem.items.findIndex((item) => item.key === key);
    if (index >= 0) setActive(index);
  };

  return (
    <section className="section section--dark problem on-dark" id={ANCHOR.problem} aria-labelledby="problem-cim">
      <div className="mesh" aria-hidden="true" />
      <div className="container">
        <div className="problem__head" ref={revealRef}>
          <p className="eyebrow">{problem.eyebrow}</p>
          <h2 id="problem-cim">{problem.title}</h2>
          <p className="section-lead">{problem.lead}</p>
        </div>

        <div className="problem__body">
          <div className="problem__figure">
            <WindowFigure
              markers={problem.items}
              activeKey={current.key}
              onSelect={selectByKey}
            />
            <p className="problem__figure-hint">
              Kattints egy jelölésre az ablakon, vagy válassz a lista közül.
            </p>
          </div>

          <div className="problem__picker">
            <div
              className="problem__tabs"
              role="tablist"
              aria-label="Gyakori problémák nyílászáróknál"
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
                  {item.label}
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
                    <h3 className="problem__panel-title">{item.title}</h3>
                    <p className="problem__panel-body">{item.body}</p>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="problem__foot">
          <p className="problem__disclaimer">
            <AlertIcon />
            <span>{problem.disclaimer}</span>
          </p>

          <Button
            size="lg"
            icon={<ArrowDownIcon />}
            onClick={() => {
              track('cta_quote_click', { placement: 'problema', context: current.key });
              scrollToId(ANCHOR.quickForm);
            }}
          >
            {problem.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
