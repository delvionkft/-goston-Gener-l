import { useEffect, useState } from 'react';
import { ANCHOR, legal } from './config/site';
import { applyDocumentHead } from './lib/seo';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { Services } from './sections/Services';
import { Calculator } from './sections/Calculator';
import { WhyUs } from './sections/WhyUs';
import { Process } from './sections/Process';
import { References } from './sections/References';
import { Testimonials } from './sections/Testimonials';
import { Faq } from './sections/Faq';
import { QuoteSection } from './sections/QuoteSection';
import { Footer } from './sections/Footer';
import { StickyContact } from './components/StickyContact';
import { TocRail } from './components/TocRail';
import { CookieConsent } from './components/CookieConsent';
import { Modal } from './components/Modal';

type LegalDoc = 'privacy' | 'imprint' | null;

/**
 * Az oldal felépítése szándékosan egy útvonalat jár be:
 * probléma → megoldás → miért mi → hogyan dolgozunk → bizonyíték →
 * kérdések → ajánlatkérés.
 */
export function App() {
  const [legalDoc, setLegalDoc] = useState<LegalDoc>(null);
  const [cookieSettings, setCookieSettings] = useState(false);

  /* Cím, meta adatok és strukturált adat beállítása. */
  useEffect(() => {
    applyDocumentHead();
  }, []);

  const doc = legalDoc ? legal[legalDoc] : null;
  const openPrivacy = () => setLegalDoc('privacy');

  return (
    <>
      <a className="skip-link" href={`#${ANCHOR.hero}`}>
        Ugrás a tartalomra
      </a>

      <Header />

      <main id="fotartalom">
        <Hero />
        <Problem />
        <Services />
        <Calculator />
        <WhyUs />
        <Process />
        <References />
        <Testimonials />
        <Faq />
        <QuoteSection onOpenPrivacy={openPrivacy} />
      </main>

      <Footer
        onOpenPrivacy={openPrivacy}
        onOpenImprint={() => setLegalDoc('imprint')}
        onOpenCookies={() => setCookieSettings(true)}
      />

      <TocRail />

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
