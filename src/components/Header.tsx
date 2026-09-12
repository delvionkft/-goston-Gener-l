import { useCallback, useEffect, useRef, useState } from 'react';
import { ANCHOR, company, cta, navLinks } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { useActiveSection } from '../hooks/useActiveSection';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Button } from './Button';
import { PhoneLink } from './ContactLinks';
import { PH } from './PlaceholderText';
import { CloseIcon, MenuIcon } from './Icons';
import './Header.css';

const NAV_IDS = navLinks.map((link) => link.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(NAV_IDS);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useFocusTrap(panelRef, menuOpen, closeMenu);

  /*
   * Két dolgot intéz egyetlen görgetésfigyelő:
   *  - a fejléc tömörebb lesz, amint elhagyjuk a hero tetejét,
   *  - a haladásjelző csík szélességét CSS-változóban állítja.
   * A csík nem React-állapot: így a görgetés nem indít újrarenderelést.
   */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      headerRef.current?.style.setProperty('--scroll-progress', `${(ratio * 100).toFixed(2)}%`);
      setScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* Ha desktop nézetre váltunk, a mobilmenü ne maradjon nyitva. */
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mql = matchMedia('(min-width: 980px)');
    const onChange = () => mql.matches && setMenuOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const go = (id: string, label: string) => {
    setMenuOpen(false);
    track('nav_click', { target: id, label });
    scrollToId(id);
  };

  const openQuote = (placement: string) => {
    setMenuOpen(false);
    track('cta_quote_click', { placement });
    scrollToId(ANCHOR.form);
  };

  return (
    <header ref={headerRef} className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      {/* Haladásjelző: megmutatja, hol tart a látogató az oldalon. */}
      <span className="header__progress" aria-hidden="true" />

      <div className="header__inner container">
        <a
          className="header__brand"
          href={`#${ANCHOR.hero}`}
          onClick={(e) => {
            e.preventDefault();
            go(ANCHOR.hero, 'logó');
          }}
        >
          {company.logo ? (
            <>
              <img
                className="header__logo"
                src={company.logo}
                alt={company.name}
                width="700"
                height="460"
              />
              <span className="visually-hidden">
                <PH value={company.name} />
              </span>
            </>
          ) : (
            <>
              <span className="header__mark" aria-hidden="true" />
              <span className="header__name">
                <PH value={company.shortName} />
              </span>
            </>
          )}
        </a>

        <nav className="header__nav" aria-label="Fő navigáció">
          <ul className="header__list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`header__link ${activeId === link.id ? 'is-active' : ''}`}
                  aria-current={activeId === link.id ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.id, link.label);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <PhoneLink placement="header" className="header__phone" />
          <Button size="md" onClick={() => openQuote('header')}>
            {cta.short}
          </Button>
        </div>

        <button
          type="button"
          className="header__burger"
          aria-expanded={menuOpen}
          aria-controls="mobil-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="visually-hidden">
            {menuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
          </span>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobilmenü */}
      <div
        className={`header__overlay ${menuOpen ? 'is-open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        id="mobil-menu"
        ref={panelRef}
        className={`header__panel ${menuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        hidden={!menuOpen}
      >
        <nav aria-label="Mobil navigáció">
          <ul className="header__panel-list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.id, link.label);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__panel-foot">
          <Button size="lg" fullWidth onClick={() => openQuote('mobil-menu')}>
            {cta.primary}
          </Button>
          <PhoneLink placement="mobil-menu" />
        </div>
      </div>
    </header>
  );
}
