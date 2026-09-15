import { useEffect, useMemo, useState } from 'react';
import { ANCHOR, calculator } from '../config/site';
import { fixWindow, unitPrices } from '../config/pricing';
import { track } from '../lib/analytics';
import { setEstimate } from '../lib/estimate';
import { fetchRate, formatEur, formatHuf, toHuf, type Rate } from '../lib/exchange';
import { scrollToNearestForm } from '../lib/scroll';
import { useReveal } from '../hooks/useReveal';
import { AccentTitle } from '../components/AccentTitle';
import { Button } from '../components/Button';
import { SectionMark } from '../components/SectionMark';
import { ArrowDownIcon, CheckIcon } from '../components/Icons';
import './Calculator.css';

type Counts = Record<string, number>;

/**
 * Árkalkulátor.
 *
 * Az árak euróban vannak (a gyártói listaárak is úgy érkeznek), a
 * megjelenítés viszont forintban, az aznapi árfolyammal — így
 * árfolyamváltozáskor nincs teendő a kódban.
 *
 * Amihez még nincs ár, azt nem találjuk ki: a kalkulátor kihagyja az
 * összegből, és külön kiírja, mi nincs benne.
 */
export function Calculator() {
  const headRef = useReveal<HTMLDivElement>();

  /* Fix ablak: méret a gyártói táblázatból. Alapból egy közepes méret. */
  const [widthIndex, setWidthIndex] = useState(4);
  const [heightIndex, setHeightIndex] = useState(4);
  const [fixCount, setFixCount] = useState(2);

  const [counts, setCounts] = useState<Counts>(() =>
    Object.fromEntries(calculator.others.items.map((item) => [item.key, 0])),
  );
  const [extras, setExtras] = useState<string[]>([]);
  const [installation, setInstallation] = useState(true);
  const [rate, setRate] = useState<Rate | null>(null);

  /* Az aznapi árfolyam. Hiba esetén a tartalék árfolyam jön vissza. */
  useEffect(() => {
    let active = true;
    fetchRate().then((value) => {
      if (active) setRate(value);
    });
    return () => {
      active = false;
    };
  }, []);

  const setCount = (key: string, value: number, max: number) =>
    setCounts((prev) => ({ ...prev, [key]: Math.max(0, Math.min(max, value)) }));

  const toggleExtra = (key: string) =>
    setExtras((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const result = useMemo(() => {
    const lines: { label: string; detail: string; eur?: number }[] = [];
    const missing: string[] = [];
    let eur = 0;

    /* Fix ablak — méret szerinti listaár. */
    const fixUnit = fixWindow.prices[heightIndex][widthIndex];
    if (fixCount > 0) {
      eur += fixCount * fixUnit;
      lines.push({
        label: `${fixWindow.label} · ${fixWindow.widths[widthIndex]} × ${fixWindow.heights[heightIndex]} cm`,
        detail: `${fixCount} db`,
        eur: fixCount * fixUnit,
      });
    }

    /* További nyílászárók — amíg nincs áruk, csak jelezzük őket. */
    for (const item of calculator.others.items) {
      const qty = counts[item.key] ?? 0;
      if (qty === 0) continue;
      const unit = unitPrices[item.key];
      if (unit > 0) {
        eur += qty * unit;
        lines.push({ label: item.label, detail: `${qty} db`, eur: qty * unit });
      } else {
        missing.push(item.label);
        lines.push({ label: item.label, detail: `${qty} db` });
      }
    }

    const totalUnits =
      fixCount + calculator.others.items.reduce((sum, item) => sum + (counts[item.key] ?? 0), 0);

    for (const extra of calculator.extras.items) {
      if (!extras.includes(extra.key) || totalUnits === 0) continue;
      const unit = unitPrices[extra.key];
      if (unit > 0) {
        eur += totalUnits * unit;
        lines.push({ label: extra.label, detail: `${totalUnits} db`, eur: totalUnits * unit });
      } else {
        missing.push(extra.label);
        lines.push({ label: extra.label, detail: `${totalUnits} db` });
      }
    }

    if (installation && totalUnits > 0) {
      const unit = unitPrices.installation;
      if (unit > 0) {
        eur += totalUnits * unit;
        lines.push({ label: calculator.installation.label, detail: `${totalUnits} db`, eur: totalUnits * unit });
      } else {
        missing.push('beépítés');
        lines.push({ label: calculator.installation.label, detail: `${totalUnits} db` });
      }
    }

    /* Emberi nyelvű összefoglaló — ez megy el az ajánlatkéréssel. */
    const parts: string[] = [];
    if (fixCount > 0) {
      parts.push(
        `${fixCount} fix ablak (${fixWindow.widths[widthIndex]}×${fixWindow.heights[heightIndex]} cm)`,
      );
    }
    for (const item of calculator.others.items) {
      const qty = counts[item.key] ?? 0;
      if (qty > 0) parts.push(`${qty} ${item.label.toLowerCase()}`);
    }
    const extraLabels = calculator.extras.items
      .filter((extra) => extras.includes(extra.key))
      .map((extra) => extra.label.toLowerCase());

    const summary = [
      parts.join(', '),
      extraLabels.length ? extraLabels.join(', ') : null,
      installation ? 'beépítéssel' : 'beépítés nélkül',
    ]
      .filter(Boolean)
      .join(' · ');

    return { eur, lines, missing, totalUnits, summary };
  }, [counts, extras, installation, fixCount, widthIndex, heightIndex]);

  /* A beállítás elérhetővé tétele az ajánlatkérő űrlap számára. */
  useEffect(() => {
    if (result.totalUnits === 0) {
      setEstimate(null);
      return;
    }
    const huf = rate ? toHuf(result.eur, rate.value) : undefined;
    setEstimate({
      text: huf
        ? `${result.summary} · kalkulált nagyságrend: ${formatHuf(huf)}`
        : result.summary,
      from: huf,
      to: huf,
    });
  }, [result, rate]);

  const fixUnitEur = fixWindow.prices[heightIndex][widthIndex];
  const hasSelection = result.totalUnits > 0;
  const huf = rate ? toHuf(result.eur, rate.value) : 0;
  const showPrice = hasSelection && result.eur > 0 && rate !== null;

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
              <legend className="calc__legend">{calculator.fix.legend}</legend>
              <p className="calc__block-hint">{calculator.fix.hint}</p>

              <div className="calc__sizes">
                <label className="calc__field">
                  <span className="calc__field-label">{calculator.fix.widthLabel}</span>
                  <select
                    value={widthIndex}
                    onChange={(event) => setWidthIndex(Number(event.target.value))}
                  >
                    {fixWindow.widths.map((band, index) => (
                      <option key={band} value={index}>
                        {band}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="calc__field">
                  <span className="calc__field-label">{calculator.fix.heightLabel}</span>
                  <select
                    value={heightIndex}
                    onChange={(event) => setHeightIndex(Number(event.target.value))}
                  >
                    {fixWindow.heights.map((band, index) => (
                      <option key={band} value={index}>
                        {band}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="calc__unit">
                <span>{calculator.fix.unitLabel}</span>
                <strong>
                  {rate ? `${formatHuf(toHuf(fixUnitEur, rate.value))} / db` : `${formatEur(fixUnitEur)} / db`}
                </strong>
              </p>

              <div className="calc__item">
                <div className="calc__item-copy">
                  <span className="calc__item-label">{calculator.fix.countLabel}</span>
                  <span className="calc__item-hint">
                    Legkisebb gyártható méret: {fixWindow.minSize}
                  </span>
                </div>
                <Stepper
                  value={fixCount}
                  max={30}
                  label={fixWindow.label}
                  onChange={(value) => setFixCount(Math.max(0, Math.min(30, value)))}
                />
              </div>
            </fieldset>

            <fieldset className="calc__block">
              <legend className="calc__legend">{calculator.others.legend}</legend>
              <ul className="calc__items">
                {calculator.others.items.map((item) => {
                  const qty = counts[item.key] ?? 0;
                  return (
                    <li className="calc__item" key={item.key}>
                      <div className="calc__item-copy">
                        <span className="calc__item-label">{item.label}</span>
                        <span className="calc__item-hint">{item.hint}</span>
                      </div>
                      <Stepper
                        value={qty}
                        max={item.max}
                        label={item.label}
                        onChange={(value) => setCount(item.key, value, item.max)}
                      />
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <fieldset className="calc__block">
              <legend className="calc__legend">{calculator.extras.legend}</legend>
              <div className="calc__chips">
                {calculator.extras.items.map((extra) => {
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
              <>
                <p className="calc__price">{formatHuf(huf)}</p>
                <p className="calc__price-eur">
                  {formatEur(result.eur)} · 1 € = {rate.value.toLocaleString('hu-HU')} Ft
                  {rate.fallback ? ' (tájékoztató árfolyam)' : ` · ${rate.date}`}
                </p>
              </>
            ) : (
              <p className="calc__result-pending">{calculator.result.pending}</p>
            )}

            {hasSelection ? (
              <ul className="calc__lines">
                {result.lines.map((line) => (
                  <li key={line.label}>
                    <span className="calc__line-name">
                      {line.label}
                      <span className="calc__line-detail">{line.detail}</span>
                    </span>
                    <span className={`calc__line-price ${line.eur === undefined ? 'is-custom' : ''}`}>
                      {line.eur !== undefined && rate
                        ? formatHuf(toHuf(line.eur, rate.value))
                        : calculator.result.customPrice}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {hasSelection && result.missing.length > 0 && result.eur > 0 ? (
              <p className="calc__missing">
                {calculator.result.missingPrefix} {result.missing.join(', ')}.
              </p>
            ) : null}

            <p className="calc__cta-hint">{calculator.result.ctaHint}</p>

            <Button
              variant="onDark"
              fullWidth
              icon={<ArrowDownIcon />}
              onClick={() => {
                track('calculator_use', {
                  placement: 'kalkulator',
                  selection: result.summary || 'üres',
                  units: result.totalUnits,
                  eur: Math.round(result.eur),
                });
                track('cta_quote_click', { placement: 'kalkulator' });
                scrollToNearestForm([ANCHOR.quickForm, ANCHOR.form]);
              }}
            >
              {calculator.result.cta}
            </Button>

            <p className="calc__disclaimer">{calculator.result.disclaimer}</p>
            <p className="calc__note">{fixWindow.note}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface StepperProps {
  value: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
}

function Stepper({ value, max, label, onChange }: StepperProps) {
  return (
    <div className="calc__stepper">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value === 0}
        aria-label={`${label}: eggyel kevesebb`}
      >
        −
      </button>
      <output aria-live="polite" aria-label={`${label} darabszáma`}>
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`${label}: eggyel több`}
      >
        +
      </button>
    </div>
  );
}
