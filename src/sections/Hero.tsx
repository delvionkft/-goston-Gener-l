import { useEffect, useRef } from 'react';
import { ANCHOR, cta, hero } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { Stats } from '../components/Stats';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon, ArrowRightIcon, CheckIcon } from '../components/Icons';
import './Hero.css';

/**
 * Hero.
 *
 * Három blokk, nem négy, és mindegyik más ritmusú — ettől olvasható:
 *
 *   1. ÜZENET   középre zárt ígéret és a két gomb. Ez kapja a legtöbb
 *               levegőt: ezen múlik, hogy a látogató marad-e.
 *   2. KÉPSÁV   a három fotó egy síkban, azonos árnyékkal — egyetlen
 *               tárgyként olvasódik, nem három külön kártyaként.
 *   3. BIZONYÍTÉK  a bizalmi pontok és a számok EGY halk sávban, a
 *               szekció alján. Nem versenyeznek a címsorral.
 *
 * A korábbi elrendezésben a bizalmi pontok a gombok és a képek közé
 * ékelődtek, és három egymás utáni háromoszlopos sor adta ki a hero-t —
 * ugyanaz a ritmus háromszor, sok szöveggel. Most a sűrű rész lekerült
 * az aljára, halkabb szedéssel.
 */
export function Hero() {
  const stripRef = useRef<HTMLUListElement>(null);

  /**
   * Mobilon a húzható képsáv a középső (legerősebb) képnél nyit. Ez egyben
   * jelzi is, hogy a sáv oldalra húzható, mert mindkét szélen kilátszik a
   * szomszédos kép. Desktopon a sáv nem görgethető, ott nincs dolga.
   */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const middle = strip.children[1] as HTMLElement | undefined;
    if (!middle || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollLeft = middle.offsetLeft - (strip.clientWidth - middle.clientWidth) / 2;
  }, []);

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
      <div className="hero__bg" aria-hidden="true" />

      {/* 1. Üzenet */}
      <div className="hero__inner container">
        <p className="eyebrow hero__eyebrow">
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
          <Button size="lg" variant="secondary" onClick={onServices} icon={<ArrowRightIcon />}>
            {cta.secondary}
          </Button>
        </div>
      </div>

      {/* 2. Képsáv. Mobilon vízszintesen húzható, a középső képnél kezdve. */}
      <div className="hero__gallery">
        <ul className="hero__strip" ref={stripRef}>
          {hero.gallery.map((item, index) => (
            <li className="hero__shot" key={item.image}>
              <ImageSlot
                src={item.image}
                alt={item.alt}
                ratio="4 / 5"
                label="[HERO KÉP]"
                priority={index === 1}
                sizes="(min-width: 900px) 32vw, 78vw"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Bizonyíték: bizalmi pontok és számok egy halk sávban. */}
      <div className="hero__proof container">
        <ul className="hero__trust">
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

        <Stats />
      </div>
    </section>
  );
}
