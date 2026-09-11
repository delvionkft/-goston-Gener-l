import { useEffect, useRef } from 'react';
import { ANCHOR, company, hero, isFilled } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { Hotspots } from '../components/Hotspots';
import { PH } from '../components/PlaceholderText';
import { telHref } from '../lib/contact';
import { ArrowDownIcon, PhoneIcon } from '../components/Icons';
import './Hero.css';

export function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  /**
   * Két finom interakció, egyetlen görgetés-/egérfigyelővel:
   *  - a képréteg lassabban mozog görgetéskor (parallax),
   *  - a kép fölött egy halvány fényfolt követi a kurzort.
   * Mindkettő CSS-változón keresztül hat, így csak `transform`-ot és
   * `opacity`-t animál — nem okoz újratördelést.
   */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || reducedMotion) return;
    if (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches) {
      // Érintőképernyőn nincs kurzor, és a parallax is inkább zavaró.
      return;
    }

    let frame = 0;
    let scrollY = window.scrollY;
    let pointer: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      const shift = Math.max(-40, Math.min(40, (scrollY - scene.offsetTop) * 0.045));
      scene.style.setProperty('--parallax', `${shift.toFixed(2)}px`);
      if (pointer) {
        scene.style.setProperty('--px', `${pointer.x}%`);
        scene.style.setProperty('--py', `${pointer.y}%`);
      }
    };

    const schedule = () => {
      frame ||= requestAnimationFrame(apply);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      schedule();
    };

    const onMove = (event: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      pointer = {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      };
      scene.style.setProperty('--glow', '1');
      schedule();
    };

    const onLeave = () => scene.style.setProperty('--glow', '0');

    window.addEventListener('scroll', onScroll, { passive: true });
    scene.addEventListener('pointermove', onMove);
    scene.addEventListener('pointerleave', onLeave);
    apply();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      scene.removeEventListener('pointermove', onMove);
      scene.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion]);

  const phone = telHref();

  const onQuote = () => {
    track('cta_quote_click', { placement: 'hero' });
    scrollToId(ANCHOR.quickForm);
  };

  return (
    <section className="hero" id={ANCHOR.hero} aria-labelledby="hero-cim">
      <div className="hero__bg" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            <PH value={hero.eyebrow} />
          </p>

          <h1 id="hero-cim" className="hero__title">
            {hero.titleBefore}
            <span className="hero__title-em">
              <PH value={hero.titleHighlight} />
            </span>
            {hero.titleAfter}
          </h1>

          <p className="hero__lead">
            <PH value={hero.lead} />
          </p>

          <div className="hero__actions">
            <Button size="lg" onClick={onQuote} icon={<ArrowDownIcon />}>
              {hero.primaryCta}
            </Button>

            {phone ? (
              <Button
                as="a"
                href={phone}
                size="lg"
                variant="secondary"
                icon={<PhoneIcon />}
                onClick={() => track('phone_click', { placement: 'hero' })}
              >
                {hero.secondaryCta}
              </Button>
            ) : (
              <span className="hero__phone-missing">
                <PhoneIcon />
                <span className="ph" title="Kitöltetlen helyőrző — src/config/site.ts">
                  [TELEFONSZÁM]
                </span>
              </span>
            )}
          </div>

          <ul className="hero__points">
            {hero.points.map((point) => (
              <li key={point.title} className="hero__point">
                <span className="hero__point-title">
                  <PH value={point.title} />
                </span>
                <span className="hero__point-text">
                  <PH value={point.text} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__scene" ref={sceneRef}>
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__frame">
            <ImageSlot
              src={hero.image || undefined}
              alt={hero.imageAlt}
              ratio="4 / 5"
              label="[FŐ KÉP]"
              priority
              sizes="(min-width: 1100px) 46vw, (min-width: 700px) 60vw, 100vw"
            />
            {/* Információs pontok a képen — érintéssel és billentyűzettel is nyílnak. */}
            <Hotspots items={hero.hotspots} label="Információs pontok a nyílászárón" />
          </div>

          {/* Lebegő réteg: a képre részben rácsúszó adatkártya */}
          <div className="hero__badge">
            <span className="hero__badge-label">Szolgáltatási terület</span>
            <span className="hero__badge-value">
              <PH value={company.serviceArea} />
            </span>
            {/* Tapasztalat csak akkor, ha valós szám van megadva. */}
            {isFilled(company.experienceYears) ? (
              <span className="hero__badge-extra">
                {company.experienceYears} éve a szakmában
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <a
        className="hero__scrollhint"
        href={`#${ANCHOR.quickForm}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(ANCHOR.quickForm);
        }}
      >
        <span>Ajánlatkérés</span>
        <ArrowDownIcon />
      </a>
    </section>
  );
}
