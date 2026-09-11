import { company, contact, isFilled, legal, socialLinks } from '../config/site';
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
  /* Csak a tényleg megadott közösségi linkek jelennek meg — nincs üres gomb. */
  const socials = socialLinks.filter((link) => isFilled(link.href));

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
            {/* Valós logó, ha a `company.logo` ki van töltve; különben a
                cégnév szöveges változata. Törött képikon így nem fordulhat elő. */}
            {isFilled(company.logo) ? (
              <img
                className="footer__logo-img"
                src={company.logo}
                alt={isFilled(company.logoAlt) ? company.logoAlt : company.name}
                width={180}
                height={44}
                loading="lazy"
              />
            ) : (
              <p className="footer__logo">
                <PH value={company.name} />
              </p>
            )}
            <p className="footer__service">Nyílászáró forgalmazás, csere és beépítés</p>

            {socials.length > 0 ? (
              <ul className="footer__social" aria-label="Közösségi oldalaink">
                {socials.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
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
              {isFilled(contact.hours) ? <li className="footer__text">{contact.hours}</li> : null}
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Cégadatok</h2>
            <ul className="footer__list footer__list--plain">
              <li className="footer__text">
                Szolgáltatási terület: <PH value={company.serviceArea} />
              </li>
              {isFilled(company.seat) || company.seat ? (
                <li className="footer__text">
                  Székhely: <PH value={company.seat} />
                </li>
              ) : null}
              {isFilled(contact.address) ? (
                <li className="footer__text">Telephely: {contact.address}</li>
              ) : null}
              {isFilled(company.taxNumber) || company.taxNumber ? (
                <li className="footer__text">
                  Adószám: <PH value={company.taxNumber} />
                </li>
              ) : null}
            </ul>
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
