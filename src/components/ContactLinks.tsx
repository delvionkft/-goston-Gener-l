import { contact } from '../config/site';
import { mailHref, telHref, telHrefSecondary } from '../lib/contact';
import { track } from '../lib/analytics';
import { PhoneIcon, MailIcon } from './Icons';
import './ContactLinks.css';

interface Props {
  /** Honnan kattintottak — a mérésnél megkülönbözteti a helyeket. */
  placement: string;
  className?: string;
}

interface PhoneProps extends Props {
  /**
   * Melyik szám. A másodlagos csak felsorolásokban jelenhet meg,
   * CTA-gombon soha — lásd a `contact` megjegyzését a site.ts-ben.
   */
  variant?: 'primary' | 'secondary';
}

/**
 * Kattintható telefonszám. Ha a szám még helyőrző, nem linkként, hanem
 * megjelölt szövegként renderel — így nem lesz működésképtelen `tel:` link.
 */
export function PhoneLink({ placement, className, variant = 'primary' }: PhoneProps) {
  const secondary = variant === 'secondary';
  const href = secondary ? telHrefSecondary() : telHref();
  const label = secondary ? contact.phoneSecondaryDisplay : contact.phoneDisplay;

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
      onClick={() => track('phone_click', { placement, variant })}
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
