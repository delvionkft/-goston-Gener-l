import { ANCHOR, company, contact, legal, social } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { ArrowDownIcon } from '../components/Icons';
import { EmailLink, PhoneLink } from '../components/ContactLinks';
import { PH } from '../components/PlaceholderText';
import './Footer.css';

interface Props {
  onOpenPrivacy: () => void;
  onOpenImprint: () => void;
  onOpenCookies: () => void;
}

export function Footer({ onOpenPrivacy, onOpenImprint, onOpenCookies }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer on-dark">
      {/* Nagyméretű, halvány cégnév a háttérben. Dekoratív, ezért a
          képernyőolvasó elől el van rejtve, és nem takarja a szöveget. */}
      {/* Háttérfelirat SVG-ben: a `textLength` miatt a szöveg pontosan
          annyi helyet foglal, amennyi van — így hosszabb cégnévnél sem lóg
          ki, és nem kell betűméretet találgatni. */}
      <div className="footer__wordmark" aria-hidden="true">
        <svg viewBox="0 0 1000 150" preserveAspectRatio="xMidYMid meet" focusable="false">
          <text
            x="500"
            y="128"
            textAnchor="middle"
            textLength="960"
            lengthAdjust="spacingAndGlyphs"
          >
            {company.shortName}
          </text>
        </svg>
      </div>

      <div className="container footer__inner">
        {/* Választóvonal az ajánlatkérő szekció és a footer között: mindkettő
            sötét, e nélkül egybefolynának. A sor egyben hasznos is — hosszú
            oldalról egy kattintással vissza lehet jutni a tetejére. */}
        <div className="footer__seam">
          <p className="footer__seam-text">
            <PH value={company.serviceArea} /> — <PH value={company.mainService} />
          </p>
          <button
            type="button"
            className="footer__totop"
            onClick={() => scrollToId(ANCHOR.hero)}
          >
            <span>Vissza a tetejére</span>
            <ArrowDownIcon />
          </button>
        </div>

        <div className="footer__top">
          <div className="footer__brand">
            {company.logo ? (
              <img
                className="footer__logo"
                src={company.logoLight || company.logo}
                alt={company.name}
                width="755"
                height="208"
              />
            ) : null}
            <p className={`footer__name ${company.logo ? 'visually-hidden' : ''}`}>
              <PH value={company.name} />
            </p>
            <p className="footer__service">
              <PH value={company.mainService} />
            </p>

            {/* Csak a ténylegesen kitöltött közösségi oldalak jelennek meg. */}
            {social.some((item) => item.href) ? (
              <ul className="footer__social">
                {social
                  .filter((item) => item.href)
                  .map((item) => (
                    <li key={item.label}>
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.label}
                      </a>
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Kapcsolat</h2>
            <ul className="footer__list">
              <li>
                <PhoneLink placement="footer" />
                {contact.phoneLabel ? (
                  <span className="footer__who">{contact.phoneLabel}</span>
                ) : null}
              </li>
              {contact.phoneDisplay2 ? (
                <li>
                  <PhoneLink placement="footer" which={2} />
                  {contact.phoneLabel2 ? (
                    <span className="footer__who">{contact.phoneLabel2}</span>
                  ) : null}
                </li>
              ) : null}
              <li>
                <EmailLink placement="footer" />
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Működési terület</h2>
            <p className="footer__text">
              <PH value={company.serviceArea} />
            </p>
            {contact.address ? <p className="footer__text">{contact.address}</p> : null}
            {contact.hours ? <p className="footer__text">{contact.hours}</p> : null}
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Jogi tudnivalók</h2>
            <ul className="footer__list">
              <li>
                {legal.privacy.href ? (
                  <a href={legal.privacy.href}>{legal.privacy.title}</a>
                ) : (
                  <button type="button" onClick={onOpenPrivacy}>
                    {legal.privacy.title}
                  </button>
                )}
              </li>
              <li>
                {legal.imprint.href ? (
                  <a href={legal.imprint.href}>{legal.imprint.title}</a>
                ) : (
                  <button type="button" onClick={onOpenImprint}>
                    {legal.imprint.title}
                  </button>
                )}
              </li>
              <li>
                <button type="button" onClick={onOpenCookies}>
                  Cookie-beállítások
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} <PH value={company.name} /> — Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
}
