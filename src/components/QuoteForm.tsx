import { useId, useRef, useState } from 'react';
import { form as formCopy } from '../config/site';
import { track } from '../lib/analytics';
import { submitLead } from '../lib/submitLead';
import { emptyForm, validate, type FormErrors, type FormValues } from '../lib/validation';
import { Button } from './Button';
import { EmailLink, PhoneLink } from './ContactLinks';
import { AlertIcon, ArrowRightIcon, CheckIcon } from './Icons';
import './QuoteForm.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  /** Melyik űrlapról van szó — a mérésben és a CRM-ben megkülönbözteti őket. */
  source: 'top' | 'bottom';
  /** Sötét háttéren világos űrlapstílus. */
  onDark?: boolean;
  /** Az adatkezelési tájékoztató megnyitása. */
  onOpenPrivacy: () => void;
}

export function QuoteForm({ source, onDark = false, onOpenPrivacy }: Props) {
  const uid = useId();
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  /** Csak az első beküldési kísérlet után mutatunk hibát mező alatt. */
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const fid = (name: string) => `${uid}-${name}`;
  const eid = (name: string) => `${uid}-${name}-hiba`;

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
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
      formRef.current
        ?.querySelector<HTMLElement>(`#${CSS.escape(fid(firstKey))}`)
        ?.focus();
      return;
    }

    setStatus('loading');
    const result = await submitLead({ ...values, source });

    if (result.ok) {
      setStatus('success');
      track(source === 'top' ? 'form_submit_top' : 'form_submit_bottom', {
        source,
        service: values.service || 'nincs megadva',
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
        <h3 className="qform__done-title">Megkaptuk az üzeneted</h3>
        <p className="qform__done-text">
          Hamarosan jelentkezünk a megadott elérhetőségen. Ha sürgős, hívj minket
          nyugodtan közvetlenül is.
        </p>
        <Button
          variant={onDark ? 'onDark' : 'secondary'}
          onClick={() => {
            setStatus('idle');
            setServerError('');
          }}
        >
          Új üzenet küldése
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
        <label htmlFor={fid('company')}>Ne töltsd ki</label>
        <input
          id={fid('company')}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="qform__grid">
        <Field
          id={fid('name')}
          errorId={eid('name')}
          label="Neved"
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
            aria-describedby={
              [submitted && errors.phone ? eid('phone') : '', `${fid('phone')}-hint`]
                .filter(Boolean)
                .join(' ') || undefined
            }
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
            aria-describedby={
              [submitted && errors.email ? eid('email') : '', `${fid('email')}-hint`]
                .filter(Boolean)
                .join(' ') || undefined
            }
            onChange={(e) => setField('email', e.target.value)}
          />
        </Field>

        <Field id={fid('service')} errorId={eid('service')} label="Mi érdekel?">
          <select
            id={fid('service')}
            name="service"
            value={values.service}
            disabled={loading}
            onChange={(e) => setField('service', e.target.value)}
          >
            <option value="">Válassz…</option>
            {formCopy.serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={fid('message')}
        errorId={eid('message')}
        label="Rövid üzenet"
        hint="Néhány mondat is elég."
        error={submitted ? errors.message : undefined}
      >
        <textarea
          id={fid('message')}
          name="message"
          rows={4}
          maxLength={2100}
          value={values.message}
          disabled={loading}
          aria-invalid={submitted && !!errors.message}
          aria-describedby={
            [submitted && errors.message ? eid('message') : '', `${fid('message')}-hint`]
              .filter(Boolean)
              .join(' ') || undefined
          }
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
          .<span className="qform__req" aria-hidden="true"> *</span>
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
              Közvetlen elérhetőségeink: <PhoneLink placement={`form-${source}-hiba`} />{' '}
              <EmailLink placement={`form-${source}-hiba`} />
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
        {loading ? 'Küldés folyamatban…' : 'Ajánlatot kérek'}
      </Button>

      <p className="qform__note">
        A megadott adatokat kizárólag a kapcsolatfelvételhez használjuk.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */

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
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
