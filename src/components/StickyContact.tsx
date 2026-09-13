import { useEffect, useState } from 'react';
import { ANCHOR, cta } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToNearestForm } from '../lib/scroll';
import { telHref } from '../lib/contact';
import { ArrowRightIcon, PhoneIcon } from './Icons';
import './StickyContact.css';

/**
 * Állandó kapcsolatfelvételi lehetőség.
 *
 * - Desktopon lebegő gomb a jobb alsó sarokban.
 * - Mobilon rögzített alsó CTA-sáv (hívás + ajánlatkérés).
 *
 * Mindkettő csak a hero elhagyása után jelenik meg — a heroban már
 * ott vannak ugyanezek a gombok, a duplázás csak zavarna. A záró
 * űrlapnál elrejtjük, hogy ne takarja a mezőket.
 */
export function StickyContact() {
  const [visible, setVisible] = useState(false);
  const phone = telHref();

  useEffect(() => {
    const check = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.75;

      /*
       * Ha bármelyik ajánlatkérő űrlap látszik, elrejtjük az állandó
       * gombokat — különben a lebegő gomb pont a beküldés gombra csúszna,
       * a mobil sáv pedig a mezőket takarná.
       */
      const formVisible = Array.from(document.querySelectorAll('.qform')).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
      });

      setVisible(pastHero && !formVisible);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  const onQuote = (placement: string) => {
    const target = scrollToNearestForm([ANCHOR.quickForm, ANCHOR.form]);
    track('cta_quote_click', { placement, target: target ?? 'nincs urlap' });
  };

  return (
    <>
      {/* Desktop: lebegő ajánlatkérő gomb */}
      <div className={`sticky-float ${visible ? 'is-visible' : ''}`}>
        <button
          type="button"
          className="sticky-float__btn"
          onClick={() => onQuote('lebego-gomb')}
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
        >
          <span>{cta.short}</span>
          <ArrowRightIcon />
        </button>
      </div>

      {/* Mobil: rögzített alsó sáv */}
      <div className={`sticky-bar ${visible ? 'is-visible' : ''}`}>
        {phone ? (
          <a
            className="sticky-bar__call"
            href={phone}
            tabIndex={visible ? 0 : -1}
            aria-hidden={!visible}
            onClick={() => track('phone_click', { placement: 'mobil-sav' })}
          >
            <PhoneIcon />
            <span>Hívás</span>
          </a>
        ) : null}
        <button
          type="button"
          className="sticky-bar__quote"
          onClick={() => onQuote('mobil-sav')}
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
        >
          {cta.short}
        </button>
      </div>
    </>
  );
}
