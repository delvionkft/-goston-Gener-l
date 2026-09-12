import { SECTIONS, sectionNumber } from '../config/site';
import { track } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { useActiveSection } from '../hooks/useActiveSection';
import './TocRail.css';

const IDS = SECTIONS.map((section) => section.id);

/**
 * Tartalomjegyzék a képernyő bal szélén.
 *
 * Csak nagy kijelzőn jelenik meg, ahol a konténer melletti üres sávban
 * elfér — kisebb kijelzőn a fejléc menüje és a haladásjelző csík adja
 * ugyanezt az információt. A címke alapból rejtett, hogy ne vonja el a
 * figyelmet a tartalomról; rámutatásra és fókuszra jelenik meg.
 */
export function TocRail() {
  const activeId = useActiveSection(IDS);

  return (
    <nav className="toc" aria-label="Szekciók">
      <ul className="toc__list">
        {SECTIONS.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <button
                type="button"
                className={`toc__item ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => {
                  track('nav_click', { target: section.id, label: 'tartalomjegyzek' });
                  scrollToId(section.id);
                }}
              >
                <span className="toc__num" aria-hidden="true">
                  {sectionNumber(section.id)}
                </span>
                <span className="toc__dot" aria-hidden="true" />
                <span className="toc__label">{section.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
