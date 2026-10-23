import { useEffect, useState } from 'react';
import { ANCHOR, legal } from './config/site';
import { applyDocumentHead } from './lib/seo';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { QuickQuote } from './sections/QuickQuote';
import { Problem } from './sections/Problem';
import { Services } from './sections/Services';
import { Calculator } from './sections/Calculator';
import { WhyUs } from './sections/WhyUs';
import { Process } from './sections/Process';
import { References } from './sections/References';
import { Testimonials } from './sections/Testimonials';
import { QuoteSection } from './sections/QuoteSection';
import { Footer } from './sections/Footer';
import { StickyContact } from './components/StickyContact';
import { TocRail } from './components/TocRail';
import { CookieConsent } from './components/CookieConsent';
import { Modal } from './components/Modal';

type LegalDoc = 'privacy' | 'cookiePolicy' | 'imprint' | null;

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
        <QuickQuote onOpenPrivacy={openPrivacy} />
        <Problem />
        <Services />
        <Calculator />
        <WhyUs />
        <Process />
        <References />
        <Testimonials />
        <QuoteSection onOpenPrivacy={openPrivacy} />
      </main>

      <Footer
        onOpenPrivacy={openPrivacy}
        onOpenCookiePolicy={() => setLegalDoc('cookiePolicy')}
        onOpenImprint={() => setLegalDoc('imprint')}
        onOpenCookies={() => setCookieSettings(true)}
      />

      <TocRail />

      <StickyContact />

      <CookieConsent
        settingsOpen={cookieSettings}
        onSettingsClose={() => setCookieSettings(false)}
        onOpenSettings={() => setCookieSettings(true)}
      />

      {doc ? (
        <Modal title={doc.title} onClose={() => setLegalDoc(null)}>
          {doc.intro ? <p className="legal__intro">{doc.intro}</p> : null}

          {doc.sections.map((section) => (
            <section className="legal__section" key={section.heading}>
              <h3 className="legal__heading">{section.heading}</h3>

              {'body' in section
                ? section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                : null}

              {'list' in section ? (
                <ul className="legal__list">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </Modal>
      ) : null}
    </>
  );
}
