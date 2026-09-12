import { contact } from '../config/site';
import { telHref, mailHref } from '../lib/contact';
import { track } from '../lib/analytics';
import { PhoneIcon, MailIcon } from './Icons';
import './ContactLinks.css';

interface Props {
  /** Honnan kattintottak — a mérésnél megkülönbözteti a helyeket. */
  placement: string;
  className?: string;
  /** Melyik szám: az elsődleges (1) vagy a második (2). */
  which?: 1 | 2;
}

/**
 * Kattintható telefonszám. Ha a szám még helyőrző, nem linkként, hanem
 * megjelölt szövegként renderel — így nem lesz működésképtelen `tel:` link.
 */
export function PhoneLink({ placement, className, which = 1 }: Props) {
  const href = telHref(which);
  const label = which === 2 ? contact.phoneDisplay2 : contact.phoneDisplay;

  // A második szám csak akkor jelenik meg, ha ki van töltve.
  if (which === 2 && !label.trim()) return null;

  if (!href) {
    return (
      <span className={`contact-link contact-link--muted ${className ?? ''}`}>
        <PhoneIcon />
        <span className="ph" title="Kitöltetlen helyőrző — src/config/site.ts">{label}</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`contact-link ${className ?? ''}`}
      onClick={() => track('phone_click', { placement, which })}
    >
      <PhoneIcon />
      <span>{label}</span>
    </a>
  );
}

/** Kattintható e-mail-cím, ugyanazzal a helyőrző-logikával. */
export function EmailLink({ placement, className }: Props) {
  const href = mailHref();
  const label = contact.email;

  if (!href) {
    return (
      <span className={`contact-link contact-link--muted ${className ?? ''}`}>
        <MailIcon />
        <span className="ph" title="Kitöltetlen helyőrző — src/config/site.ts">{label}</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`contact-link ${className ?? ''}`}
      onClick={() => track('email_click', { placement })}
    >
      <MailIcon />
      <span>{label}</span>
    </a>
  );
}
