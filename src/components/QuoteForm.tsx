import { useEffect, useId, useRef, useState } from 'react';
import { activeServices, contact, form as formCopy, isFilled } from '../config/site';
import { track } from '../lib/analytics';
import { submitLead } from '../lib/submitLead';
import { emptyForm, MESSAGE_MAX, validate, type FormErrors, type FormValues } from '../lib/validation';
import { Button } from './Button';
import { EmailLink, PhoneLink } from './ContactLinks';
import { AlertIcon, ArrowRightIcon, CheckIcon, ClockIcon } from './Icons';
import './QuoteForm.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Spamvédelem második rétege: ha a beküldés a megjelenés után ennél
 * hamarabb érkezik, szinte biztosan automata. Embernek a legrövidebb
 * kitöltés is több másodperc.
 */
const MIN_FILL_MS = 2500;

interface Props {
  /** Melyik űrlapról van szó — a mérésben és a CRM-ben megkülönbözteti őket. */
  source: 'top' | 'bottom';
  /** Sötét háttéren világos űrlapstílus. */
  onDark?: boolean;
  /** A beküldés gomb felirata. */
  submitLabel?: string;
  /** Az adatkezelési tájékoztató megnyitása. */
  onOpenPrivacy: () => void;
}

export function QuoteForm({
  source,
  onDark = false,
  submitLabel = 'Ajánlatot kérek',
  onOpenPrivacy,
}: Props) {
  const uid = useId();
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  /** Csak az első beküldési kísérlet után mutatunk hibát mező alatt. */
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  /** Az „űrlap megkezdése” eseményt űrlaponként csak egyszer küldjük. */
  const startTracked = useRef(false);
  const mountedAt = useRef(0);

  /* A megjelenés időpontja a spamszűrőhöz. Effektben vesszük fel, hogy a
     renderelés tiszta (mellékhatásmentes) maradjon. */
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  /*
   * Az asszisztens által összegyűjtött válaszok átvétele. Eseményen
   * keresztül megy, nem közös állapoton: így az űrlap semmit nem tud az
   * asszisztensről, és fordítva — bármelyik eltávolítható a másik nélkül.
   * A látogató által már beírt mezőt nem írjuk felül.
   */
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const detail = (event as CustomEvent<Record<string, string>>).detail ?? {};
      setValues((prev) => ({
        ...prev,
        service: prev.service || detail.service || '',
        city: prev.city || detail.city || '',
        message:
          prev.message ||
          [detail.scope && `Mennyiség: ${detail.scope}`, detail.timing && `Időzítés: ${detail.timing}`]
            .filter(Boolean)
            .join('\n'),
      }));
      startTracked.current = true;
    };
    window.addEventListener('lead-prefill', onPrefill);
    return () => window.removeEventListener('lead-prefill', onPrefill);
  }, []);

  const fid = (name: string) => `${uid}-${name}`;
  const eid = (name: string) => `${uid}-${name}-hiba`;

  /** Az első érdemi interakcióra elsül az „űrlap megkezdése” esemény. */
  const markStarted = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    track('form_start', { source });
  };

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    markStarted();
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      // Beküldés után élőben tisztítjuk a javított mezők hibáit.
      if (submitted) setErrors(validate(next));
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError('');

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      track('form_error', { source, fields: Object.keys(found).join(',') });
      // A fókusz az első hibás mezőre kerül — billentyűzettel is használható.
      const firstKey = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fid(firstKey))}`)?.focus();
      return;
    }

    /*
     * Spamvédelem. Mindkét szűrő csendben sikert mutat a küldőnek:
     * a botnak nem adunk visszajelzést arról, min bukott el.
     */
    const trap = formRef.current?.querySelector<HTMLInputElement>('input[name="cegnev"]');
    const tooFast = Date.now() - mountedAt.current < MIN_FILL_MS;
    if (trap?.value || tooFast) {
      track('form_error', { source, reason: 'spam_filter' });
      setStatus('success');
      return;
    }

    setStatus('loading');
    const result = await submitLead({ ...values, source });

    if (result.ok) {
      setStatus('success');
      track(source === 'top' ? 'form_submit_top' : 'form_submit_bottom', {
        source,
        service: values.service || 'nincs megadva',
        city: values.city.trim() || 'nincs megadva',
      });
      setValues(emptyForm);
      setSubmitted(false);
    } else {
      setStatus('error');
      setServerError(result.error);
      track('form_error', { source, reason: 'submit_failed' });
    }
  };

  /* --- Sikeres beküldés visszajelzése --- */
  if (status === 'success') {
    return (
      <div className={`qform qform--done ${onDark ? 'on-dark' : ''}`} role="status">
        <span className="qform__done-icon" aria-hidden="true">
          <CheckIcon />
        </span>
        <h3 className="qform__done-title">Megkaptuk az ajánlatkérésed</h3>
        <p className="qform__done-text">
          {isFilled(contact.responseTime)
            ? `Jelentkezünk a megadott elérhetőségen, jellemzően ${contact.responseTime}.`
            : 'Hamarosan jelentkezünk a megadott elérhetőségen.'}{' '}
          Ha sürgős, hívj minket nyugodtan közvetlenül is.
        </p>
        <div className="qform__done-contacts">
          <PhoneLink placement={`urlap-${source}-siker`} />
          <EmailLink placement={`urlap-${source}-siker`} />
        </div>
        <Button
          variant={onDark ? 'onDark' : 'secondary'}
          onClick={() => {
            setStatus('idle');
            setServerError('');
            mountedAt.current = Date.now();
            startTracked.current = false;
          }}
        >
          Új ajánlatkérés indítása
        </Button>
      </div>
    );
  }

  const loading = status === 'loading';

  return (
    <form
      ref={formRef}
      className={`qform ${onDark ? 'on-dark' : ''}`}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={loading}
    >
      {/* Rejtett csapdamező az automata kitöltők ellen. Nem látszik,
          és a képernyőolvasó is átugorja. */}
      <div className="qform__trap" aria-hidden="true">
        <label htmlFor={fid('cegnev')}>Ne töltsd ki</label>
        <input id={fid('cegnev')} name="cegnev" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="qform__grid">
        <Field
          id={fid('name')}
          errorId={eid('name')}
          label="Név"
          required
          error={submitted ? errors.name : undefined}
        >
          <input
            id={fid('name')}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            disabled={loading}
            aria-invalid={submitted && !!errors.name}
            aria-describedby={submitted && errors.name ? eid('name') : undefined}
            onChange={(e) => setField('name', e.target.value)}
          />
        </Field>

        <Field
          id={fid('phone')}
          errorId={eid('phone')}
          label="Telefonszám"
          required
          hint="Ezen hívunk vissza."
          highlight
          error={submitted ? errors.phone : undefined}
        >
          <input
            id={fid('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+36 30 123 4567"
            value={values.phone}
            disabled={loading}
            aria-invalid={submitted && !!errors.phone}
            aria-describedby={describedBy(submitted && errors.phone, eid('phone'), fid('phone'))}
            onChange={(e) => setField('phone', e.target.value)}
          />
        </Field>

        <Field
          id={fid('email')}
          errorId={eid('email')}
          label="E-mail-cím"
          hint="Nem kötelező."
          error={submitted ? errors.email : undefined}
        >
          <input
            id={fid('email')}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nev@pelda.hu"
            value={values.email}
            disabled={loading}
            aria-invalid={submitted && !!errors.email}
            aria-describedby={describedBy(submitted && errors.email, eid('email'), fid('email'))}
            onChange={(e) => setField('email', e.target.value)}
          />
        </Field>

        <Field
          id={fid('city')}
          errorId={eid('city')}
          label="Település"
          required
          error={submitted ? errors.city : undefined}
        >
          <input
            id={fid('city')}
            name="city"
            type="text"
            autoComplete="address-level2"
            value={values.city}
            disabled={loading}
            aria-invalid={submitted && !!errors.city}
            aria-describedby={submitted && errors.city ? eid('city') : undefined}
            onChange={(e) => setField('city', e.target.value)}
          />
        </Field>
      </div>

      <Field
        id={fid('service')}
        errorId={eid('service')}
        label="Milyen munkára van szükséged?"
        hint="Ha még nem tudod pontosan, válaszd az utolsó lehetőséget."
      >
        <select
          id={fid('service')}
          name="service"
          value={values.service}
          disabled={loading}
          aria-describedby={`${fid('service')}-hint`}
          onChange={(e) => setField('service', e.target.value)}
        >
          <option value="">Válassz…</option>
          {activeServices.map((service) => (
            <option key={service.key} value={service.label}>
              {service.label}
            </option>
          ))}
          <option value={formCopy.otherOption}>{formCopy.otherOption}</option>
        </select>
      </Field>

      <Field
        id={fid('message')}
        errorId={eid('message')}
        label="Rövid üzenet"
        hint="Néhány mondat is elég: hány nyílászáróról van szó, és mi a cél."
        error={submitted ? errors.message : undefined}
      >
        <textarea
          id={fid('message')}
          name="message"
          rows={4}
          maxLength={MESSAGE_MAX + 100}
          value={values.message}
          disabled={loading}
          aria-invalid={submitted && !!errors.message}
          aria-describedby={describedBy(submitted && errors.message, eid('message'), fid('message'))}
          onChange={(e) => setField('message', e.target.value)}
        />
      </Field>

      <div className={`qform__consent ${submitted && errors.consent ? 'has-error' : ''}`}>
        <input
          id={fid('consent')}
          name="consent"
          type="checkbox"
          checked={values.consent}
          disabled={loading}
          aria-invalid={submitted && !!errors.consent}
          aria-describedby={submitted && errors.consent ? eid('consent') : undefined}
          onChange={(e) => setField('consent', e.target.checked)}
        />
        <label htmlFor={fid('consent')}>
          Elolvastam és elfogadom az{' '}
          <button type="button" className="qform__link" onClick={onOpenPrivacy}>
            adatkezelési tájékoztatót
          </button>
          , és hozzájárulok az adataim kezeléséhez.
          <span className="qform__req" aria-hidden="true"> *</span>
          <span className="visually-hidden"> (kötelező)</span>
        </label>
      </div>
      {submitted && errors.consent ? (
        <p className="qform__error" id={eid('consent')} role="alert">
          <AlertIcon />
          {errors.consent}
        </p>
      ) : null}

      {status === 'error' && serverError ? (
        <div className="qform__banner qform__banner--error" role="alert">
          <AlertIcon />
          <div>
            <p>{serverError}</p>
            <p className="qform__banner-contact">
              Közvetlen elérhetőségeink: <PhoneLink placement={`urlap-${source}-hiba`} />{' '}
              <EmailLink placement={`urlap-${source}-hiba`} />
            </p>
          </div>
        </div>
      ) : null}

      <Button
        as="button"
        type="submit"
        size="lg"
        fullWidth
        variant={onDark ? 'onDark' : 'primary'}
        disabled={loading}
        icon={loading ? <Spinner /> : <ArrowRightIcon />}
      >
        {loading ? 'Küldés folyamatban…' : submitLabel}
      </Button>

      <p className="qform__note">
        {isFilled(contact.responseTime) ? (
          <>
            <ClockIcon />
            <span>Válasz jellemzően {contact.responseTime}. </span>
          </>
        ) : null}
        <span>A megadott adatokat kizárólag a kapcsolatfelvételhez használjuk.</span>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */

/** Hiba- és súgóazonosítók összefűzése az `aria-describedby` mezőhöz. */
function describedBy(hasError: unknown, errorId: string, fieldId: string): string | undefined {
  return [hasError ? errorId : '', `${fieldId}-hint`].filter(Boolean).join(' ') || undefined;
}

interface FieldProps {
  id: string;
  errorId: string;
  label: string;
  hint?: string;
  required?: boolean;
  /** Vizuálisan kiemelt mező — a telefonszám az elsődleges csatorna. */
  highlight?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, errorId, label, hint, required, highlight, error, children }: FieldProps) {
  return (
    <div className={`qfield ${error ? 'has-error' : ''} ${highlight ? 'is-primary' : ''}`}>
      <label className="qfield__label" htmlFor={id}>
        {label}
        {required ? (
          <>
            <span className="qform__req" aria-hidden="true"> *</span>
            <span className="visually-hidden"> (kötelező)</span>
          </>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p className="qfield__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="qform__error" id={errorId} role="alert">
          <AlertIcon />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="qform__spinner" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2.4" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
