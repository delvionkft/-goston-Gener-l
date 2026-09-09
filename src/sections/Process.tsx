import { useEffect, useRef, useState } from 'react';
import { ANCHOR, process as processCopy } from '../config/site';
import { track } from '../lib/analytics';
import { useReveal } from '../hooks/useReveal';
import { PH } from '../components/PlaceholderText';
import './Process.css';

/** Igaz, ha az idővonalat animáció nélkül, azonnal késznek kell mutatni. */
function staticFallback(): boolean {
  if (typeof IntersectionObserver === 'undefined') return true;
  return (
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Munkafolyamat idővonal.
 *
 * Görgetéskor a lépések egyenként aktiválódnak. Egyetlen
 * IntersectionObserver figyeli az összes lépést, és csak egy CSS-osztályt
 * kapcsol — nincs görgetésre kötött számolás, így a fő szál nem terhelődik.
 * Csökkentett mozgás esetén minden lépés azonnal aktív.
 */
export function Process() {
  const headRef = useReveal<HTMLDivElement>();
  const listRef = useRef<HTMLOListElement>(null);
  /*
   * Csökkentett mozgás vagy hiányzó IntersectionObserver esetén minden
   * lépés azonnal aktív — ezt már a kezdőállapotban eldöntjük, hogy ne
   * legyen egy renderelésnyi „inaktív” villanás.
   */
  const [activeSteps, setActiveSteps] = useState<Set<number>>(() =>
    staticFallback() ? new Set(processCopy.steps.map((_, i) => i)) : new Set(),
  );

  useEffect(() => {
    const list = listRef.current;
    if (!list || staticFallback()) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>('.process__step'));
    const observer = new IntersectionObserver(
      (entries) => {
        const reached: number[] = [];
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          reached.push(index);
          observer.unobserve(entry.target);
        }
        if (reached.length === 0) return;
        setActiveSteps((prev) => {
          const next = new Set(prev);
          reached.forEach((i) => next.add(i));
          return next;
        });
        track('process_step_view', { step: Math.max(...reached) + 1 });
      },
      { rootMargin: '0px 0px -22% 0px', threshold: 0.35 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  /** A kitöltött vonal hossza az aktivált lépések arányában. */
  const progress =
    processCopy.steps.length > 1
      ? (Math.max(-1, ...Array.from(activeSteps)) / (processCopy.steps.length - 1)) * 100
      : 0;

  return (
    <section className="section process" id={ANCHOR.process} aria-labelledby="process-cim">
      <div className="container">
        <div className="process__head" ref={headRef}>
          <p className="eyebrow">{processCopy.eyebrow}</p>
          <h2 id="process-cim">{processCopy.title}</h2>
          <p className="section-lead">{processCopy.lead}</p>
        </div>

        <ol
          className="process__list"
          ref={listRef}
          style={{ '--progress': `${Math.max(0, progress)}%` } as React.CSSProperties}
        >
          {processCopy.steps.map((step, index) => (
            <li
              key={step.title}
              data-index={index}
              className={`process__step ${activeSteps.has(index) ? 'is-active' : ''}`}
            >
              <span className="process__marker" aria-hidden="true">
                <span className="process__dot" />
              </span>
              {/* A tartalom külön blokkban van, hogy a vízszintes idővonalon
                  egyetlen egységként lehessen a vonal fölé vagy alá helyezni. */}
              <div className="process__content">
                <span className="process__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="process__title">
                  <PH value={step.title} />
                </h3>
                <p className="process__text">
                  <PH value={step.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
