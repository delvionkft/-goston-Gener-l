import { useEffect, useId, useRef, useState } from 'react';
import { cta, form as formCopy } from '../config/site';
import { track } from '../lib/analytics';
import { submitLead } from '../lib/submitLead';
import { emptyForm, validate, type FormErrors, type FormValues } from '../lib/validation';
import { Button } from './Button';
import { EmailLink, PhoneLink } from './ContactLinks';
import { AlertIcon, ArrowRightIcon, CheckIcon, ChevronLeftIcon } from './Icons';
import './QuoteForm.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  /** Honnan jött a lead. A mérésben és a CRM-ben ez különbözteti meg a helyeket. */
  source: string;
  /** Sötét háttéren világos űrlapstílus. */
  onDark?: boolean;
  /** Az adatkezelési tájékoztató megnyitása. */
  onOpenPrivacy: () => void;
}

const QUESTIONS = formCopy.questions;
/** A négy kérdés után jön az elérhetőség — ez az utolsó lépés indexe. */
const CONTACT_STEP = QUESTIONS.length;
const TOTAL_STEPS = QUESTIONS.length + 1;

/**
 * Ajánlatkérő kérdőív.
 *
 * Négy egyérintéses minősítő kérdés, majd az elérhetőség. A sorrend
 * szándékos: a könnyű kérdések megindítják a kitöltést, és mire a
 * telefonszámra kerül a sor, a kitöltő már befektetett négy kattintást.
 * Cserébe a hívás előtt tudod, mekkora a munka, mire van szükség,
 * mennyire sürgős és hol van az ingatlan.
 */
export function QuoteForm({ source, onDark = false, onOpenPrivacy }: Props) {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  /** Csak az első beküldési kísérlet után mutatunk hibát a mezők alatt. */
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  /** Az első lépésen még nem mozgatjuk a fókuszt — az a betöltéskor zavaró. */
  const moved = useRef(false);

  const fid = (name: string) => `${uid}-${name}`;
  const eid = (name: string) => `${uid}-${name}-hiba`;

  /* Lépésváltáskor a fókusz az új lépés címére kerül, hogy a képernyőolvasó
     felolvassa, és a billentyűzetes navigáció is a helyes ponton folytatódjon. */
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (submitted) setErrors(validate(next));
      return next;
    });
  };

  const answer = (index: number, key: keyof FormValues, option: string) => {
    setValues((prev) => ({ ...prev, [key]: option }));
    track('form_step', {
      source,
      step: index + 1,
      question: key,
      answer: option,
    });
    setStep(index + 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError('');

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      track('form_error', { source, fields: Object.keys(found).join(',') });
      const firstKey = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fid(firstKey))}`)?.focus();
      return;
    }

    setStatus('loading');
    const result = await submitLead({ ...values, source });

    if (result.ok) {
      track('form_submit', {
        source,
        propertyType: values.propertyType,
        windowCount: values.windowCount,
        needs: values.needs,
        timing: values.timing,
        city: values.city || 'nincs megadva',
      });

      /*
       * Ha be van állítva külön köszönőoldal, oda navigálunk — így a GA4-ben
       * oldalletöltés-alapú konverzió is mérhető.
       */
      if (formCopy.thankYouUrl) {
        window.location.assign(formCopy.thankYouUrl);
        return;
      }

      setStatus('success');
      setValues(emptyForm);
      setSubmitted(false);
      setStep(0);
    } else {
      setStatus('error');
      setServerError(result.error);
      track('form_error', { source, reason: 'submit_failed' });
    }
  };

  /* --- Köszönőüzenet sikeres beküldés után --- */
  if (status === 'success') {
    return (
      <div className={`qform qform--done ${onDark ? 'on-dark' : ''}`} role="status">
        <span className="qform__done-icon" aria-hidden="true">
          <CheckIcon />
        </span>
        <h3 className="qform__done-title">{formCopy.thankYou.title}</h3>
        <p className="qform__done-text">{formCopy.thankYou.lead}</p>
        <ul className="qform__done-list">
          {formCopy.thankYou.points.map((point) => (
            <li key={point}>
              <CheckIcon />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="qform__done-contact">
          <PhoneLink placement={`koszono-${source}`} />
        </div>
        <Button
          variant={onDark ? 'onDark' : 'secondary'}
          onClick={() => {
            setStatus('idle');
            setServerError('');
          }}
        >
          Új ajánlatkérés küldése
        </Button>
      </div>
    );
  }

  const loading = status === 'loading';
  const question = step < CONTACT_STEP ? QUESTIONS[step] : null;

  return (
    <form
      ref={formRef}
      className={`qform ${onDark ? 'on-dark' : ''}`}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={loading}
    >
      {/* Rejtett csapdamező az automata kitöltő robotok ellen. */}
      <div className="qform__trap" aria-hidden="true">
        <label htmlFor={fid('company')}>Ne töltsd ki</label>
        <input id={fid('company')} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Haladás */}
      <div className="qform__head">
        <button
          type="button"
          className="qform__back"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          hidden={step === 0}
        >
          <ChevronLeftIcon />
          <span>Vissza</span>
        </button>
        <p className="qform__count">
          <span aria-hidden="true">
            {step + 1} / {TOTAL_STEPS}
          </span>
          <span className="visually-hidden">
            {step + 1}. lépés a(z) {TOTAL_STEPS} lépésből
          </span>
        </p>
      </div>
      <div className="qform__progress" aria-hidden="true">
        <span style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
      </div>

      <p className="qform__step-title" ref={headingRef} tabIndex={-1}>
        {question ? question.title : formCopy.contactStep.title}
      </p>
      <p className="qform__step-hint">
        {question ? question.hint : formCopy.contactStep.hint}
      </p>

      {/* --- Minősítő kérdés --- */}
      {question ? (
        <div className="qform__options">
          {question.options.map((option) => {
            const selected = values[question.key] === option;
            return (
              <button
                type="button"
                key={option}
                className={`qform__option ${selected ? 'is-selected' : ''}`}
                aria-pressed={selected}
                onClick={() => answer(step, question.key, option)}
              >
                <span>{option}</span>
                <ArrowRightIcon />
              </button>
            );
          })}
        </div>
      ) : (
        <>
          {/* A megadott válaszok — visszakattinthatók, ha valamit módosítani kell. */}
          <ul className="qform__chips">
            {QUESTIONS.map((item, index) =>
              values[item.key] ? (
                <li key={item.key}>
                  <button type="button" onClick={() => setStep(index)}>
                    {values[item.key]}
                  </button>
                </li>
              ) : null,
            )}
          </ul>

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
              hint="Ezen a számon hívunk vissza."
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
              id={fid('city')}
              errorId={eid('city')}
              label="Az ingatlan települése"
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
          </div>

          <Field
            id={fid('message')}
            errorId={eid('message')}
            label="Rövid üzenet"
            hint="Nem kötelező — néhány mondat is elég."
            error={submitted ? errors.message : undefined}
          >
            <textarea
              id={fid('message')}
              name="message"
              rows={3}
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
              Hozzájárulok, hogy a megadott adataimat a kapcsolatfelvételhez kezeljék, és
              elolvastam az{' '}
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
            {loading ? 'Küldés folyamatban…' : cta.primary}
          </Button>

          <p className="qform__note">
            A megadott adatokat kizárólag a kapcsolatfelvételhez használjuk, harmadik
            félnek nem adjuk át.
          </p>
        </>
      )}
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
