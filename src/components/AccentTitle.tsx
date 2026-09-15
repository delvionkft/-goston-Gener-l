import './AccentTitle.css';

interface Props {
  /** A teljes címsor szövege. */
  text: string;
  /** A benne szereplő szó, ami kézzel húzott aláhúzást kap. */
  accent?: string;
}

/**
 * Címsor egyetlen kiemelt szóval.
 *
 * A kiemelt szó alá egy enyhén szabálytalan, kézzel húzottnak ható ív
 * kerül — ez oldja a szigorú tipográfiát anélkül, hogy a szöveget
 * díszítménnyé tenné. A vonal megjelenéskor rajzolódik ki.
 */
export function AccentTitle({ text, accent }: Props) {
  if (!accent || !text.includes(accent)) return <>{text}</>;

  const [before, ...rest] = text.split(accent);
  const after = rest.join(accent);

  /* A kiemelt szó után közvetlenül álló írásjel nem szakadhat új sorba —
     e nélkül a „…nagyságrendben, mibe kerülne" címsorban a vessző magában
     kezdett új sort. Ezért a szóval együtt egy nem törhető dobozba kerül. */
  const glued = after.match(/^[\s]*[,.;:!?)\]}»"']+/)?.[0] ?? '';
  const tail = after.slice(glued.length);

  return (
    <>
      {before}
      <span className="accent-word__glue">
      <span className="accent-word">
        {accent}
        <svg
          className="accent-word__line"
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* Kissé hullámos vonal — a tökéletes egyenes gépiesen hatna. */}
          <path d="M2 8.5C38 3.6 96 2.4 198 5.8" />
        </svg>
      </span>
      {glued}
      </span>
      {tail}
    </>
  );
}
