import { useEffect, useState } from 'react';
import { ANCHOR, legal } from './config/site';
import { applyDocumentHead } from './lib/seo';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { QuickQuote } from './sections/QuickQuote';
import { Problem } from './sections/Problem';
import { Solution } from './sections/Solution';
import { References } from './sections/References';
import { Process } from './sections/Process';
import { FinalCta } from './sections/FinalCta';
import { Footer } from './sections/Footer';
import { StickyContact } from './components/StickyContact';
import { CookieConsent } from './components/CookieConsent';
import { Modal } from './components/Modal';

type LegalDoc = 'privacy' | 'imprint' | null;

export function App() {
  const [legalDoc, setLegalDoc] = useState<LegalDoc>(null);
  const [cookieSettings, setCookieSettings] = useState(false);

  /* Cím, meta adatok és strukturált adat beállítása. */
  useEffect(() => {
    applyDocumentHead();
  }, []);

  const doc = legalDoc ? legal[legalDoc] : null;

  return (
    <>
      <a className="skip-link" href={`#${ANCHOR.hero}`}>
        Ugrás a tartalomra
      </a>

      <Header />

      <main id="fotartalom">
        <Hero />
        <QuickQuote onOpenPrivacy={() => setLegalDoc('privacy')} />
        <Problem />
        <Solution />
        <References />
        <Process />
        <FinalCta onOpenPrivacy={() => setLegalDoc('privacy')} />
      </main>

      <Footer
        onOpenPrivacy={() => setLegalDoc('privacy')}
        onOpenImprint={() => setLegalDoc('imprint')}
        onOpenCookies={() => setCookieSettings(true)}
      />

      <StickyContact />

      <CookieConsent
        settingsOpen={cookieSettings}
        onSettingsClose={() => setCookieSettings(false)}
      />

      {doc ? (
        <Modal title={doc.title} onClose={() => setLegalDoc(null)}>
          <p>{doc.body}</p>
        </Modal>
      ) : null}
    </>
  );
}
