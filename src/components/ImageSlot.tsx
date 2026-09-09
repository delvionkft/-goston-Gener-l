import './ImageSlot.css';

interface Props {
  /** Kép útvonala a /public mappához képest, pl. '/hero.jpg'. Üres = helyőrző. */
  src?: string;
  /** Kötelező alternatív szöveg. Írd le, mit ábrázol a kép. */
  alt: string;
  /** Képarány CSS-formában, pl. '4 / 5'. A torzulás így kizárt. */
  ratio?: string;
  /** A helyőrzőn megjelenő címke. */
  label?: string;
  /** Az első képernyőn látható képnél `true` — ilyenkor nincs lazy betöltés. */
  priority?: boolean;
  className?: string;
  /** `sizes` attribútum a reszponzív betöltéshez. */
  sizes?: string;
}

/**
 * Képhely. Ha van valós kép, `object-fit: cover` mellett, rögzített
 * képaránnyal jeleníti meg — így soha nem torzul és nem okoz elrendezés-
 * ugrást (CLS). Ha nincs, egy jól látható, megtervezett helyőrző jelenik meg,
 * ami egyértelműen jelzi, hogy ide valós fotó kerül.
 */
export function ImageSlot({
  src,
  alt,
  ratio = '4 / 3',
  label = '[KÉP]',
  priority = false,
  className,
  sizes,
}: Props) {
  const style = { '--ratio': ratio } as React.CSSProperties;

  if (!src) {
    return (
      <div
        className={`imgslot imgslot--empty ${className ?? ''}`}
        style={style}
        role="img"
        aria-label={`Képhelyőrző: ${alt}`}
      >
        <div className="imgslot__grain" aria-hidden="true" />
        <div className="imgslot__mark">
          <span className="imgslot__label">{label}</span>
          <span className="imgslot__hint">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`imgslot ${className ?? ''}`} style={style}>
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
      />
    </div>
  );
}
