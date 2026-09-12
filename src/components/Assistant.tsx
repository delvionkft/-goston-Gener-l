import { useEffect, useId, useRef, useState } from 'react';
import { ANCHOR, activeServices } from '../config/site';
import { assistant, type AssistantStep } from '../config/assistant';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { telHref } from '../lib/contact';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { CloseIcon, PhoneIcon, SparkIcon } from './Icons';
import './Assistant.css';

type Answers = Partial<Record<'service' | 'scope' | 'timing' | 'city', string>>;

/** Az első kérdés a szolgáltatásokból áll össze, hogy egy helyen legyen karbantartva. */
const serviceStep: AssistantStep = {
  key: 'service',
  question: 'Miben tudok segíteni?',
  note: 'Válassz egyet — később bármikor pontosíthatod.',
  options: activeServices.map((service) => ({ label: service.label, hint: service.summary })),
};

const steps: readonly AssistantStep[] = [serviceStep, ...assistant.steps];

/**
 * Ajánlatkérő asszisztens.
 *
 * Vezetett párbeszéd, nem szabad szövegű chat — az indoklás a
 * `config/assistant.ts` fejlécében van. A végén az összegyűjtött
 * válaszokat átadja az ajánlatkérő űrlapnak egy `lead-prefill`
 * eseménnyel, és odagörget. Így az asszisztens nem egy külön sziget:
 * ugyanabba a konverziós folyamatba vezet, mint minden más CTA.
 */
export function Assistant() {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [typing, setTyping] = useState(false);
  const [cityDraft, setCityDraft] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useFocusTrap(panelRef, open, () => setOpen(false));

  const done = index >= steps.length;
  const current = done ? null : steps[index];

  /* Új üzenetnél a napló aljára görgetünk. */
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [index, typing, open]);

  const answer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    track('assistant_answer', { step: key, value });

    // Rövid „gondolkodás", hogy a válasz ne pattanjon be azonnal.
    if (reduced) {
      setIndex((i) => i + 1);
      return;
    }
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setIndex((i) => i + 1);
    }, assistant.typingMs);
  };

  const start = () => {
    setOpen(true);
    track('assistant_open', {});
  };

  const restart = () => {
    setAnswers({});
    setCityDraft('');
    setIndex(0);
    track('assistant_restart', {});
  };

  /** Átadás az ajánlatkérő űrlapnak. */
  const handOff = () => {
    window.dispatchEvent(new CustomEvent('lead-prefill', { detail: answers }));
    track('assistant_handoff', {
      service: answers.service ?? '',
      scope: answers.scope ?? '',
      timing: answers.timing ?? '',
    });
    track('cta_quote_click', { placement: 'asszisztens' });
    setOpen(false);
    scrollToId(ANCHOR.quickForm);
  };

  const phone = telHref();

  return (
    <>
      <button
        type="button"
        className={`asst-launch ${open ? 'is-hidden' : ''}`}
        onClick={start}
        aria-expanded={open}
        aria-controls={`${uid}-panel`}
      >
        <span className="asst-launch__icon" aria-hidden="true">
          <SparkIcon />
        </span>
        <span className="asst-launch__label">{assistant.launcher}</span>
        <span className="asst-launch__pulse" aria-hidden="true" />
      </button>

      <div
        className={`asst ${open ? 'is-open' : ''}`}
        id={`${uid}-panel`}
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label={assistant.title}
        hidden={!open}
      >
        <header className="asst__head">
          <div>
            <p className="asst__title">{assistant.title}</p>
            <p className="asst__subtitle">{assistant.subtitle}</p>
          </div>
          <button type="button" className="asst__close" onClick={() => setOpen(false)}>
            <CloseIcon />
            <span className="visually-hidden">Asszisztens bezárása</span>
          </button>
        </header>

        <div className="asst__log" ref={logRef}>
          <Bubble>{assistant.greeting}</Bubble>

          {steps.slice(0, index).map((step) => (
            <div key={step.key}>
              <Bubble>{step.question}</Bubble>
              <p className="asst__answer">{answers[step.key]}</p>
            </div>
          ))}

          {typing ? (
            <div className="asst__bubble asst__bubble--typing" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          ) : null}

          {current && !typing ? (
            <>
              <Bubble>
                {current.question}
                {current.note ? <span className="asst__note">{current.note}</span> : null}
              </Bubble>

              {current.options.length > 0 ? (
                <div className="asst__options">
                  {current.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      className="asst__option"
                      onClick={() => answer(current.key, option.label)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  className="asst__free"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const value = cityDraft.trim();
                    if (!value) return;
                    answer(current.key, value);
                  }}
                >
                  <label className="visually-hidden" htmlFor={`${uid}-free`}>
                    {current.question}
                  </label>
                  <input
                    id={`${uid}-free`}
                    type="text"
                    value={cityDraft}
                    placeholder={current.placeholder}
                    autoComplete="address-level2"
                    onChange={(event) => setCityDraft(event.target.value)}
                  />
                  <button type="submit" disabled={!cityDraft.trim()}>
                    Tovább
                  </button>
                </form>
              )}
            </>
          ) : null}

          {done && !typing ? (
            <div className="asst__summary">
              <p className="asst__summary-title">{assistant.summaryTitle}</p>
              <dl className="asst__summary-list">
                {steps.map((step) =>
                  answers[step.key] ? (
                    <div key={step.key}>
                      <dt>{labelFor(step.key)}</dt>
                      <dd>{answers[step.key]}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
              <p className="asst__summary-lead">{assistant.summaryLead}</p>

              <div className="asst__actions">
                <button type="button" className="asst__primary" onClick={handOff}>
                  {assistant.primaryCta}
                </button>
                {phone ? (
                  <a
                    className="asst__secondary"
                    href={phone}
                    onClick={() => track('phone_click', { placement: 'asszisztens' })}
                  >
                    <PhoneIcon />
                    {assistant.secondaryCta}
                  </a>
                ) : null}
              </div>

              <button type="button" className="asst__restart" onClick={restart}>
                {assistant.restart}
              </button>
            </div>
          ) : null}
        </div>

        {!done ? (
          <div className="asst__progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${index / steps.length})` }} />
          </div>
        ) : null}
      </div>
    </>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return <div className="asst__bubble">{children}</div>;
}

function labelFor(key: string): string {
  switch (key) {
    case 'service':
      return 'Szolgáltatás';
    case 'scope':
      return 'Mennyiség';
    case 'timing':
      return 'Időzítés';
    case 'city':
      return 'Település';
    default:
      return key;
  }
}
