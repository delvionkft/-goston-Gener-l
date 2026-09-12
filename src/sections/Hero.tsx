import { useEffect, useRef } from 'react';
import { ANCHOR, company, cta, hero } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon, ArrowRightIcon, CheckIcon } from '../components/Icons';
import './Hero.css';

export function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  /**
   * Két visszafogott interakció, egyetlen görgetés- és egérfigyelővel:
   *  - a képréteg lassabban mozog görgetéskor (parallax),
   *  - a kép fölött halvány fényfolt követi a kurzort.
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
      const shift = Math.max(-36, Math.min(36, (scrollY - scene.offsetTop) * 0.04));
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

  const onQuote = () => {
    track('cta_quote_click', { placement: 'hero' });
    scrollToId(ANCHOR.form);
  };

  const onServices = () => {
    track('nav_click', { target: ANCHOR.services, label: 'hero-masodlagos' });
    scrollToId(ANCHOR.services);
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
            {hero.title}
          </h1>

          <p className="hero__lead">{hero.lead}</p>

          <div className="hero__actions">
            <Button size="lg" onClick={onQuote} icon={<ArrowDownIcon />}>
              {cta.primary}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onServices}
              icon={<ArrowRightIcon />}
            >
              {cta.secondary}
            </Button>
          </div>

          {/* Három rövid bizalmi elem közvetlenül a gombok alatt. */}
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
          </div>

          {/* Lebegő kártya a képre csúszva — szolgáltatási terület. */}
          <div className="hero__badge">
            <span className="hero__badge-label">Működési terület</span>
            <span className="hero__badge-value">
              <PH value={company.serviceArea} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
