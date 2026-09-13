import { ANCHOR, cta, services } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToNearestForm } from '../lib/scroll';
import { useReveal } from '../hooks/useReveal';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { PH } from '../components/PlaceholderText';
import { ArrowDownIcon } from '../components/Icons';
import { SERVICE_ICONS } from '../components/serviceIcons';
import { SectionMark } from '../components/SectionMark';
import './Services.css';

/**
 * Szolgáltatások kártyás elrendezésben.
 *
 * A kép opcionális: ha a konfigurációban nincs kitöltve `image`, a kártya
 * a letisztult vonalas ikonnal jelenik meg. Így az oldal fotók nélkül is
 * rendezett marad — nem hat félkésznek hat üres képhelyőrzővel.
 */
export function Services() {
  const headRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLUListElement>();

  const onQuote = () => {
    track('cta_quote_click', { placement: 'szolgaltatasok' });
    scrollToNearestForm([ANCHOR.quickForm, ANCHOR.form]);
  };

  return (
    <section className="section services" id={ANCHOR.services} aria-labelledby="services-cim">
      <SectionMark id={ANCHOR.services} />
      <div className="container">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">{services.eyebrow}</p>
          <h2 id="services-cim">{services.title}</h2>
          <p className="section-lead">{services.lead}</p>
        </div>

        <ul className="services__grid" ref={gridRef}>
          {services.items.map((item, index) => {
            const Icon = SERVICE_ICONS[item.icon];
            return (
              <li
                className="services__card card"
                key={item.key}
                style={{ '--reveal-delay': `${index * 60}ms` } as React.CSSProperties}
              >
                {item.image ? (
                  <div className="services__media">
                    <ImageSlot
                      src={item.image}
                      alt={item.imageAlt}
                      ratio="16 / 10"
                      sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ) : (
                  <span className="services__icon" aria-hidden="true">
                    <Icon />
                  </span>
                )}

                <h3 className="services__title">{item.title}</h3>
                <p className="services__text">
                  <PH value={item.body} />
                </p>
              </li>
            );
          })}
        </ul>

        <div className="services__cta">
          <p className="services__cta-text">
            Nem vagy biztos benne, melyik megoldás a jó? Írd le a helyzetet, és a
            felmérésen átbeszéljük.
          </p>
          <Button size="lg" icon={<ArrowDownIcon />} onClick={onQuote}>
            {cta.primary}
          </Button>
        </div>
      </div>
    </section>
  );
}
