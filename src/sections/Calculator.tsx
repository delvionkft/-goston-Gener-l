import { useEffect, useMemo, useState } from 'react';
import { ANCHOR, calculator } from '../config/site';
import { track } from '../lib/analytics';
import { formatPrice, setEstimate } from '../lib/estimate';
import { scrollToNearestForm } from '../lib/scroll';
import { useReveal } from '../hooks/useReveal';
import { Button } from '../components/Button';
import { PH } from '../components/PlaceholderText';
import { AccentTitle } from '../components/AccentTitle';
import { SectionMark } from '../components/SectionMark';
import { ArrowDownIcon, CheckIcon } from '../components/Icons';
import './Calculator.css';

type Counts = Record<string, number>;

/** Kerekítés tízezresre — a pontosabb szám hamis pontosságot sugallna. */
function roundPrice(value: number): number {
  return Math.round(value / 10000) * 10000;
}

/**
 * Árkalkulátor.
 *
 * Nem árajánlat-generátor, hanem nagyságrend-mutató: a látogató lássa,
 * milyen tartományban mozog a dolog, mielőtt telefonál. Ezért mindig
 * sávot mutat, és mindig ott van mellette, hogy a pontos ár a felmérés
 * után jön.
 *
 * Amíg a konfigurációban nincsenek valós árak (`pricesReady: false`),
 * összeg helyett a beállítás összefoglalója jelenik meg — kitalált
 * számot nem mutatunk.
 */
export function Calculator() {
  const headRef = useReveal<HTMLDivElement>();

  const [counts, setCounts] = useState<Counts>(() =>
    Object.fromEntries(calculator.items.map((item) => [item.key, item.key === 'ablak' ? 3 : 0])),
  );
  const [glazing, setGlazing] = useState<string>(calculator.glazing[0].key);
  const [extras, setExtras] = useState<string[]>([]);
  const [installation, setInstallation] = useState(true);

  const setCount = (key: string, value: number, max: number) =>
    setCounts((prev) => ({ ...prev, [key]: Math.max(0, Math.min(max, value)) }));

  const toggleExtra = (key: string) =>
    setExtras((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const result = useMemo(() => {
    const multiplier =
      calculator.glazing.find((option) => option.key === glazing)?.multiplier ?? 1;

    /* Összes nyílászáró: ehhez igazodik a beépítés díja. */
    const totalUnits = calculator.items.reduce((sum, item) => sum + (counts[item.key] ?? 0), 0);
    /* Redőny és szúnyogháló ablakra és erkélyajtóra kerül, bejárati ajtóra nem. */
    const shadedUnits = calculator.items
      .filter((item) => item.key !== 'bejarati')
      .reduce((sum, item) => sum + (counts[item.key] ?? 0), 0);

    let from = 0;
    let to = 0;
    const lines: { label: string; detail: string }[] = [];

    for (const item of calculator.items) {
      const qty = counts[item.key] ?? 0;
      if (qty === 0) continue;
      from += qty * item.from * multiplier;
      to += qty * item.to * multiplier;
      lines.push({ label: item.label, detail: `${qty} db` });
    }

    for (const extra of calculator.extras) {
      if (!extras.includes(extra.key) || shadedUnits === 0) continue;
      from += shadedUnits * extra.from;
      to += shadedUnits * extra.to;
      lines.push({ label: extra.label, detail: `${shadedUnits} db` });
    }

    if (installation && totalUnits > 0) {
      from += totalUnits * calculator.installation.from;
      to += totalUnits * calculator.installation.to;
      lines.push({ label: calculator.installation.label, detail: `${totalUnits} db` });
    }

    /* Emberi nyelvű összefoglaló — ez megy el a leaddel is. */
    const parts: string[] = [];
    for (const item of calculator.items) {
      const qty = counts[item.key] ?? 0;
      if (qty > 0) parts.push(`${qty} ${item.label.toLowerCase()}`);
    }
    const glazingLabel =
      calculator.glazing.find((option) => option.key === glazing)?.label ?? '';
    const extraLabels = calculator.extras
      .filter((extra) => extras.includes(extra.key))
      .map((extra) => extra.label.toLowerCase());

    const summary = [
      parts.join(', '),
      glazingLabel.toLowerCase(),
      extraLabels.length ? extraLabels.join(', ') : null,
      installation ? 'beépítéssel' : 'beépítés nélkül',
    ]
      .filter(Boolean)
      .join(' · ');

    return { from, to, lines, totalUnits, summary };
  }, [counts, glazing, extras, installation]);

  /* A beállítás elérhetővé tétele az ajánlatkérő űrlap számára. */
  useEffect(() => {
    if (result.totalUnits === 0) {
      setEstimate(null);
      return;
    }
    setEstimate({
      text: result.summary,
      from: calculator.pricesReady ? roundPrice(result.from) : undefined,
      to: calculator.pricesReady ? roundPrice(result.to) : undefined,
    });
  }, [result]);

  const hasSelection = result.totalUnits > 0;
  const showPrice = calculator.pricesReady && hasSelection && result.to > 0;

  return (
    <section className="section calc" id={ANCHOR.calculator} aria-labelledby="calc-cim">
      <SectionMark id={ANCHOR.calculator} />

      <div className="container">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">{calculator.eyebrow}</p>
          <h2 id="calc-cim">
            <AccentTitle text={calculator.title} accent={calculator.accent} />
          </h2>
          <p className="section-lead">{calculator.lead}</p>
        </div>

        <div className="calc__grid">
          {/* --- Vezérlők --- */}
          <div className="calc__controls">
            <fieldset className="calc__block">
              <legend className="calc__legend">Mennyi nyílászáróról van szó?</legend>
              <ul className="calc__items">
                {calculator.items.map((item) => {
                  const qty = counts[item.key] ?? 0;
                  return (
                    <li className="calc__item" key={item.key}>
                      <div className="calc__item-copy">
                        <span className="calc__item-label">{item.label}</span>
                        <span className="calc__item-hint">{item.hint}</span>
                      </div>
                      <div className="calc__stepper">
                        <button
                          type="button"
                          onClick={() => setCount(item.key, qty - 1, item.max)}
                          disabled={qty === 0}
                          aria-label={`${item.label}: eggyel kevesebb`}
                        >
                          −
                        </button>
                        <output aria-live="polite" aria-label={`${item.label} darabszáma`}>
                          {qty}
                        </output>
                        <button
                          type="button"
                          onClick={() => setCount(item.key, qty + 1, item.max)}
                          disabled={qty >= item.max}
                          aria-label={`${item.label}: eggyel több`}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <fieldset className="calc__block">
              <legend className="calc__legend">Üvegezés</legend>
              <div className="calc__segments">
                {calculator.glazing.map((option) => (
                  <button
                    type="button"
                    key={option.key}
                    className={`calc__segment ${glazing === option.key ? 'is-active' : ''}`}
                    aria-pressed={glazing === option.key}
                    onClick={() => setGlazing(option.key)}
                  >
                    <span>{option.label}</span>
                    <span className="calc__segment-hint">{option.hint}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="calc__block">
              <legend className="calc__legend">Kiegészítők</legend>
              <div className="calc__chips">
                {calculator.extras.map((extra) => {
                  const on = extras.includes(extra.key);
                  return (
                    <button
                      type="button"
                      key={extra.key}
                      className={`calc__chip ${on ? 'is-on' : ''}`}
                      aria-pressed={on}
                      onClick={() => toggleExtra(extra.key)}
                    >
                      <span className="calc__chip-mark" aria-hidden="true">
                        {on ? <CheckIcon /> : null}
                      </span>
                      {extra.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="calc__switch">
              <label htmlFor="calc-beepites">
                <span className="calc__item-label">{calculator.installation.label}</span>
                <span className="calc__item-hint">{calculator.installation.hint}</span>
              </label>
              <input
                id="calc-beepites"
                type="checkbox"
                role="switch"
                checked={installation}
                onChange={(event) => setInstallation(event.target.checked)}
              />
            </div>
          </div>

          {/* --- Eredmény --- */}
          <aside className="calc__result" aria-live="polite">
            <p className="calc__result-label">{calculator.result.label}</p>

            {!hasSelection ? (
              <p className="calc__result-empty">{calculator.result.empty}</p>
            ) : showPrice ? (
              <p className="calc__price">
                <span>{formatPrice(roundPrice(result.from), calculator.currency)}</span>
                <span className="calc__price-sep" aria-hidden="true">
                  –
                </span>
                <span>{formatPrice(roundPrice(result.to), calculator.currency)}</span>
              </p>
            ) : (
              <p className="calc__result-pending">{calculator.result.pending}</p>
            )}

            {hasSelection ? (
              <ul className="calc__lines">
                {result.lines.map((line) => (
                  <li key={line.label}>
                    <span>{line.label}</span>
                    <span className="calc__line-detail">{line.detail}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <Button
              size="lg"
              fullWidth
              icon={<ArrowDownIcon />}
              onClick={() => {
                track('calculator_use', {
                  placement: 'kalkulator',
                  selection: result.summary || 'üres',
                  units: result.totalUnits,
                });
                track('cta_quote_click', { placement: 'kalkulator' });
                scrollToNearestForm([ANCHOR.quickForm, ANCHOR.form]);
              }}
            >
              {calculator.result.cta}
            </Button>

            <p className="calc__disclaimer">{calculator.result.disclaimer}</p>
            <p className="calc__note">
              <PH value={calculator.priceNote} />
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
