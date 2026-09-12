/**
 * ============================================================================
 *  VALÓDI AI BEKÖTÉSI PONT — jelenleg NINCS bekapcsolva
 * ============================================================================
 *
 *  Az asszisztens alapból vezetett párbeszéd: determinisztikus, és csak azt
 *  mondja, amit a `config/assistant.ts` tartalmaz. Ha később szabad szöveges
 *  AI-választ is szeretnél, ez a fájl az egyetlen hely, amit módosítani kell.
 *
 *  KÖTELEZŐ TUDNI, MIELŐTT BEKAPCSOLOD:
 *
 *  1. SOHA ne tegyél modell-API-kulcsot a böngészőbe. A frontend kódját
 *     bárki elolvassa. Kell egy saját szerveroldali végpont, ami a kulcsot
 *     őrzi, és ami felé ez a fájl kérdez.
 *  2. A rendszerpromptban szigorúan tiltsd le az árazást, a határidő-
 *     vállalást és a garanciát. Egy modell, ami árat mond, olyat ígér a
 *     cég nevében, amit nem biztos, hogy tartani tud.
 *  3. Tegyél rá sebességkorlátot, különben a végpontod fizeti a
 *     visszaélést.
 *
 *  BEKAPCSOLÁS:
 *    VITE_ASSISTANT_ENDPOINT=https://api.sajatceg.hu/asszisztens
 *  A végpont `{ messages: [{role, content}] }` objektumot kap, és
 *  `{ reply: string }` választ ad vissza.
 * ============================================================================
 */

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ENDPOINT = import.meta.env.VITE_ASSISTANT_ENDPOINT as string | undefined;

/** Igaz, ha a szabad szöveges mód be van kötve. */
export function aiEnabled(): boolean {
  return typeof ENDPOINT === 'string' && ENDPOINT.trim().length > 0;
}

export async function askAssistant(
  messages: AssistantMessage[],
): Promise<{ ok: true; reply: string } | { ok: false; error: string }> {
  if (!ENDPOINT) {
    return { ok: false, error: 'Az asszisztens szabad szöveges módja nincs bekötve.' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as { reply?: string };
    if (!data.reply) throw new Error('Üres válasz.');
    return { ok: true, reply: data.reply };
  } catch {
    return {
      ok: false,
      error: 'Most nem érem el az asszisztenst. Kérj ajánlatot az űrlapon, vagy hívj minket.',
    };
  } finally {
    clearTimeout(timer);
  }
}
