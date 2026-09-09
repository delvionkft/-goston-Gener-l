import { useCallback, useEffect, useRef, useState } from 'react';
import { ANCHOR, company, navLinks } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Button } from './Button';
import { PhoneLink } from './ContactLinks';
import { PH } from './PlaceholderText';
import { CloseIcon, MenuIcon } from './Icons';
import './Header.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useFocusTrap(panelRef, menuOpen, closeMenu);

  /* A fejléc tömörebb lesz, amint elhagyjuk a hero tetejét. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Aktív menüpont jelölése — melyik szekció van épp a nézetben. */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Ha desktop nézetre váltunk, a mobilmenü ne maradjon nyitva. */
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mql = matchMedia('(min-width: 900px)');
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
    scrollToId(ANCHOR.quickForm);
  };

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header__inner container">
        <a
          className="header__brand"
          href={`#${ANCHOR.hero}`}
          onClick={(e) => {
            e.preventDefault();
            go(ANCHOR.hero, 'logó');
          }}
        >
          <span className="header__mark" aria-hidden="true" />
          <span className="header__name">
            <PH value={company.shortName} />
          </span>
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
            Ajánlatot kérek
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
            Ajánlatot kérek
          </Button>
          <PhoneLink placement="mobil-menu" />
        </div>
      </div>
    </header>
  );
}
