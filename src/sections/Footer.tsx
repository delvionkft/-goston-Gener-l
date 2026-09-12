import { company, contact, legal, social } from '../config/site';
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
      <div className="footer__wordmark" aria-hidden="true">
        <span>{company.shortName}</span>
      </div>

      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            {company.logo ? (
              <img className="footer__logo" src={company.logo} alt="" width="160" height="40" />
            ) : null}
            <p className="footer__name">
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
              </li>
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
