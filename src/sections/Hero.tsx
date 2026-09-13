import { ANCHOR, company, cta, hero } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon, ArrowRightIcon, CheckIcon } from '../components/Icons';
import './Hero.css';

/**
 * Hero: középre zárt üzenet, alatta képsáv.
 *
 * A szöveg kapja a teljes szélességet — az ígéretet másodpercek alatt el
 * kell olvasni —, a képek pedig alatta, széles sávban következnek. Középen
 * a legerősebb kép: ez látszik mobilon is elsőként.
 */
export function Hero() {
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

      {/* Képsáv. Mobilon vízszintesen húzható, középen kezdve. */}
      <div className="hero__gallery">
        <ul className="hero__strip">
          {hero.gallery.map((item, index) => (
            <li className={`hero__shot hero__shot--${index + 1}`} key={item.image}>
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

        <div className="hero__badge">
          <span className="hero__badge-label">Működési terület</span>
          <span className="hero__badge-value">
            <PH value={company.serviceAreaShort} />
          </span>
        </div>
      </div>
    </section>
  );
}
