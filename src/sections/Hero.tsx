import { ANCHOR, cta, hero } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { Button } from '../components/Button';
import { Stats } from '../components/Stats';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon, ArrowRightIcon, CheckIcon } from '../components/Icons';
import './Hero.css';

/**
 * Hero: teljes szélességű háttérfotó, rajta a mondanivaló.
 *
 *   FOTÓ    a szekció teljes területét kitölti, a fejléc mögé is befut —
 *           így nincs vízszintes törés az oldal tetején.
 *   FÁTYOL  antracit színátmenet a fotón. Ez nem dekoráció: enélkül a
 *           szöveg kontrasztja a fotó világos foltjain leesne. Alul a
 *           legerősebb, felül szinte átlátszó, hogy a kép megmaradjon.
 *   SZÖVEG  a fotó ALSÓ HARMADÁBAN, balra zárva. Felül marad szabad
 *           képfelület — ettől lesz levegős.
 *   SZÁMOK  a fotó alsó peremén, hajszálvonal fölött.
 *   PÁRKÁNY a fotó ALATT, világos sávon: a három bizalmi pont.
 *
 * SZÁNDÉKOSAN KEVÉS ELEM VAN A KÉPEN. A három bizalmi pont azért került
 * a kép alá, mert szöveges felsorolásként a fotón zsúfolttá tette volna
 * a kompozíciót — a képnek lélegeznie kell.
 */
export function Hero() {
  const { cover } = hero;

  const onQuote = () => {
    track('cta_quote_click', { placement: 'hero' });
    scrollToId(ANCHOR.quickForm);
  };

  const onServices = () => {
    track('nav_click', { target: ANCHOR.services, label: 'hero-masodlagos' });
    scrollToId(ANCHOR.services);
  };

  return (
    <section className="hero" id={ANCHOR.hero} aria-labelledby="hero-cim">
      <div className="hero__frame">
        {/* A fotó. Nem `background-image`: így kap srcset-et, és a böngésző
            a legnagyobb tartalmi elemként (LCP) előre tudja tölteni. */}
        <picture className="hero__photo">
          <source
            media="(min-width: 760px)"
            srcSet={`${cover.wideSmall} 1100w, ${cover.wide} 1800w`}
            sizes="100vw"
          />
          <img
            src={cover.portrait}
            srcSet={`${cover.portraitSmall} 700w, ${cover.portrait} 1000w`}
            sizes="100vw"
            alt={cover.alt}
            fetchPriority="high"
            decoding="sync"
            draggable={false}
          />
        </picture>

        <div className="hero__veil" aria-hidden="true" />

        <div className="hero__inner container">
          <div className="hero__copy">
            <p className="hero__eyebrow">
              <PH value={hero.eyebrow} />
            </p>

            <h1 id="hero-cim" className="hero__title">
              {hero.title}
            </h1>

            <p className="hero__lead">{hero.lead}</p>

            <div className="hero__actions">
              <Button size="lg" onClick={onQuote} icon={<ArrowDownIcon />}>
                {cta.primary}
              </Button>
              <Button
                size="lg"
                variant="outlineLight"
                onClick={onServices}
                icon={<ArrowRightIcon />}
              >
                {cta.secondary}
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* --- Számsáv: önálló antracit sáv a fotó ALATT ---
          Korábban a képre került, de telefonon a három szám egymás alá
          csúszott, és feketére takarta a fotó alsó felét. Külön sávban
          mindkét méreten rendezett marad, a kép pedig végig kép marad. */}
      <div className="hero__facts">
        <Stats onDark />
      </div>

      {/* --- Párkány: a kép alatti világos sáv --- */}
      <div className="hero__ledge">
        <ul className="hero__trust container">
          {hero.trust.map((point) => (
            <li key={point.title} className="hero__trust-item">
              <span className="hero__trust-icon" aria-hidden="true">
                <CheckIcon />
              </span>
              <span className="hero__trust-copy">
                <strong>{point.title}</strong>
                <span>{point.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
