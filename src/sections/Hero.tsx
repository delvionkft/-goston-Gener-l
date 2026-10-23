import { ANCHOR, cta, hero } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { Stats } from '../components/Stats';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon, ArrowRightIcon, CheckIcon } from '../components/Icons';
import './Hero.css';

/**
 * Hero: klasszikus kétosztatú elrendezés, antracit alapon.
 *
 * A sötét alap a márkapaletta szerinti szerep: az antracit a „nagy, sötét
 * képrétegek és kiemelt blokkok" színe — stabil, komoly, építőipari
 * karakter. A hero az oldal legnagyobb kiemelt blokkja, ezért ez kapja.
 * A `section--dark` osztály hozza magával az oldal meglévő sötét
 * konvencióit (kiemelés, címsorok, bevezető színei).
 *
 *   BAL   balra zárt üzenet — kiemelés, címsor, bevezető, két gomb, és
 *         alattuk a három bizalmi pont egymás alatt.
 *   JOBB  egyetlen nagy fotó, függőlegesen középre igazítva.
 *   ALUL  teljes szélességű számsáv.
 *
 * A forrásrend szándékosan üzenet → kép → bizalmi pontok: mobilon így a
 * fotó rögtön a gombok után jön, nem a szöveges lista mögé szorul. A
 * desktop elrendezést a rács állítja vissza.
 *
 * Az `hero.gallery` tömb első eleme kerül ki. A másik kettő a
 * konfigurációban marad: ha másik képet akarsz, elég a sorrendet
 * átírni vagy a fájlt felülírni, kódot nem kell módosítani.
 */
export function Hero() {
  const shot = hero.gallery[0];

  const onQuote = () => {
    track('cta_quote_click', { placement: 'hero' });
    scrollToId(ANCHOR.quickForm);
  };

  const onServices = () => {
    track('nav_click', { target: ANCHOR.services, label: 'hero-masodlagos' });
    scrollToId(ANCHOR.services);
  };

  return (
    <section className="hero section--dark" id={ANCHOR.hero} aria-labelledby="hero-cim">
      <div className="hero__bg" aria-hidden="true" />

      <div className="hero__inner container">
        {/* --- Bal oszlop: az üzenet --- */}
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            <PH value={hero.eyebrow} />
          </p>

          <h1 id="hero-cim" className="hero__title">
            {hero.title}
          </h1>

          <p className="hero__lead">{hero.lead}</p>

          <div className="hero__actions">
            <Button size="lg" onClick={onQuote} icon={<ArrowDownIcon />}>
              {cta.primary}
            </Button>
            <Button size="lg" variant="secondary" onClick={onServices} icon={<ArrowRightIcon />}>
              {cta.secondary}
            </Button>
          </div>

        </div>

        {/* --- Jobb oszlop: egyetlen kép ---
            A forrásban a bizalmi pontok ELŐTT áll, hogy mobilon rögtön a
            gombok után jöjjön. Desktopon a rács teszi a jobb hasábba. */}
        <div className="hero__media">
          <ImageSlot
            src={shot.image}
            alt={shot.alt}
            ratio="4 / 5"
            label="[HERO KÉP]"
            priority
            sizes="(min-width: 980px) 46vw, 100vw"
          />
        </div>

        <ul className="hero__trust">
          {hero.trust.map((point) => (
            <li key={point.title} className="hero__trust-item">
              <span className="hero__trust-icon" aria-hidden="true">
                <CheckIcon />
              </span>
              <span className="hero__trust-copy">
                <strong>{point.title}</strong>
                <span>{point.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Számsáv a hero alján, teljes szélességben --- */}
      <div className="hero__stats">
        <Stats />
      </div>
    </section>
  );
}
