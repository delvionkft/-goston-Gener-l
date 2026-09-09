import type { ReactNode } from 'react';
import { isPlaceholder } from '../config/site';

interface Props {
  value: string;
  /** Ha meg van adva, a helyőrző helyett ez jelenik meg. */
  fallback?: ReactNode;
}

/**
 * Szöveget jelenít meg, és ha az még kitöltetlen helyőrző (pl. `[CÉGNÉV]`),
 * vizuálisan megjelöli. Fejlesztői módban feltűnő, éles buildben visszafogott,
 * de felismerhető — így nem lehet észrevétlenül kitöltetlenül élesíteni.
 */
export function PH({ value, fallback }: Props) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return (
    <span className="ph" title="Kitöltetlen helyőrző — cseréld le a src/config/site.ts fájlban">
      {fallback ?? value}
    </span>
  );
}
