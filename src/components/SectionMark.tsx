import { sectionNumber } from '../config/site';
import './SectionMark.css';

interface Props {
  /** A szekció horgonya — ebből jön a sorszám. */
  id: string;
}

/**
 * Szekciósorszám a jobb felső sarokban (01, 02…).
 *
 * Dekoratív tájékozódási pont: a sorrendet mutatja, a jelentést a
 * szekció címsora hordozza — ezért a képernyőolvasó elől el van rejtve.
 */
export function SectionMark({ id }: Props) {
  const number = sectionNumber(id);
  if (!number) return null;

  return (
    <span className="section-mark" aria-hidden="true">
      {number}
    </span>
  );
}
