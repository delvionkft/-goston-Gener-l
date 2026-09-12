import { ANCHOR, why } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { SectionMark } from '../components/SectionMark';
import './WhyUs.css';

/**
 * „Miért minket” — konkrét ügyfélelőnyök, számozott listában.
 * Nem szlogen-felsorolás: minden pont egy megfogható ígéret.
 */
export function WhyUs() {
  const headRef = useReveal<HTMLDivElement>();
  const listRef = useReveal<HTMLOListElement>();

  return (
    <section className="section why" id={ANCHOR.why} aria-labelledby="why-cim">
      <SectionMark id={ANCHOR.why} />
      <div className="container why__inner">
        <div className="why__head" ref={headRef}>
          <p className="eyebrow">{why.eyebrow}</p>
          <h2 id="why-cim">{why.title}</h2>
          <p className="section-lead">{why.lead}</p>
        </div>

        <ol className="why__list" ref={listRef}>
          {why.items.map((item, index) => (
            <li className="why__item" key={item.title}>
              <span className="why__num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="why__copy">
                <h3 className="why__title">{item.title}</h3>
                <p className="why__text">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
