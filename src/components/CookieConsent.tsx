import { useCallback, useEffect, useState } from 'react';
import { cookies } from '../config/site';
import { setConsent } from '../lib/analytics';
import { Button } from './Button';
import { Modal } from './Modal';
import './CookieConsent.css';

const STORAGE_KEY = 'cookie-consent-v1';

export interface ConsentValue {
  analytics: boolean;
  marketing: boolean;
}

function read(): ConsentValue | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentValue>;
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    // Privát ablak vagy letiltott tárolás — ilyenkor nincs mentett döntés.
    return null;
  }
}

function write(value: ConsentValue): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // A mentés meghiúsulása nem akadályozhatja meg a döntés érvényesülését.
  }
}

interface Props {
  /** Igaz, ha a footerből nyitották meg a beállításokat. */
  settingsOpen: boolean;
  onSettingsClose: () => void;
}

export function CookieConsent({ settingsOpen, onSettingsClose }: Props) {
  /*
   * A mentett döntést már az első renderelés előtt beolvassuk. Így a
   * süti-sáv nem villan fel egy pillanatra annál, aki korábban már döntött.
   */
  const [saved] = useState(read);
  const [decided, setDecided] = useState(() => saved !== null);
  const [draft, setDraft] = useState<ConsentValue>(
    () => saved ?? { analytics: false, marketing: false },
  );

  /* A mérési réteg értesítése — ez külső rendszerrel való szinkronizálás. */
  useEffect(() => {
    if (saved) setConsent(saved);
  }, [saved]);

  const apply = useCallback(
    (value: ConsentValue) => {
      write(value);
      setConsent(value);
      setDraft(value);
      setDecided(true);
      onSettingsClose();
    },
    [onSettingsClose],
  );

  const showBanner = !decided && !settingsOpen;

  return (
    <>
      {showBanner ? (
        <div
          className="cookiebar"
          role="region"
          aria-label={cookies.title}
        >
          <div className="cookiebar__inner">
            <div className="cookiebar__text">
              <p className="cookiebar__title">{cookies.title}</p>
              <p>{cookies.body}</p>
            </div>
            <div className="cookiebar__actions">
              <Button
                variant="secondary"
                onClick={() => apply({ analytics: false, marketing: false })}
              >
                Csak a szükségeseket
              </Button>
              <Button onClick={() => apply({ analytics: true, marketing: true })}>
                Mindet elfogadom
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {settingsOpen ? (
        <Modal
          title="Cookie-beállítások"
          onClose={onSettingsClose}
          footer={
            <div className="cookiebar__modal-actions">
              <Button
                variant="secondary"
                onClick={() => apply({ analytics: false, marketing: false })}
              >
                Csak a szükségesek
              </Button>
              <Button onClick={() => apply(draft)}>Beállítások mentése</Button>
            </div>
          }
        >
          <p>{cookies.body}</p>
          <ul className="cookiebar__cats">
            {cookies.categories.map((cat) => {
              const isOn =
                cat.required ||
                (cat.key === 'analytics' ? draft.analytics : draft.marketing);
              return (
                <li key={cat.key} className="cookiebar__cat">
                  <div className="cookiebar__cat-text">
                    <label htmlFor={`cookie-${cat.key}`}>{cat.label}</label>
                    <p>{cat.description}</p>
                  </div>
                  <input
                    id={`cookie-${cat.key}`}
                    type="checkbox"
                    checked={isOn}
                    disabled={cat.required}
                    onChange={(e) =>
                      setDraft((prev) =>
                        cat.key === 'analytics'
                          ? { ...prev, analytics: e.target.checked }
                          : { ...prev, marketing: e.target.checked },
                      )
                    }
                  />
                </li>
              );
            })}
          </ul>
        </Modal>
      ) : null}
    </>
  );
}
