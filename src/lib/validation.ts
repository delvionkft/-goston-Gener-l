/**
 * Űrlap-mezőellenőrzés. Magyar nyelvű, konkrét hibaüzenetekkel.
 * Szándékosan megengedő: a cél a valós hibák kiszűrése, nem a
 * szabályos, de szokatlan adatok elutasítása.
 */

export interface FormValues {
  name: string;
  phone: string;
  email: string;
  /** Település — a felmérés megszervezéséhez az egyik legfontosabb adat. */
  city: string;
  service: string;
  message: string;
  consent: boolean;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

/**
 * Magyar és nemzetközi telefonszámokat is elfogad. Legalább 7,
 * legfeljebb 15 számjegy — az E.164 szabvány szerinti tartomány.
 */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^\d]/g, '');
  if (digits.length < 7 || digits.length > 15) return false;
  return /^[+\d][\d\s()/.-]*$/.test(value.trim());
}

/**
 * Egyszerű, de valós hibákat kiszűrő e-mail-ellenőrzés.
 * Nem próbálja lefedni az RFC 5322 teljes nyelvtanát — az többet ártana.
 */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value.trim());
}

export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Írd be a neved, hogy tudjuk, kihez szóljunk.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Ez túl rövidnek tűnik. Írd be a teljes neved.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'A telefonszám kell, hogy vissza tudjunk hívni.';
  } else if (!isValidPhone(values.phone)) {
    errors.phone = 'Ez nem tűnik érvényes telefonszámnak. Például: +36 30 123 4567';
  }

  // Az e-mail nem kötelező — a telefonszám az elsődleges csatorna —,
  // de ha megadják, legyen érvényes.
  if (values.email.trim() && !isValidEmail(values.email)) {
    errors.email = 'Ellenőrizd az e-mail-címet. Például: nev@pelda.hu';
  }

  if (values.city.trim().length > 80) {
    errors.city = 'Ez túl hosszú egy településnévhez.';
  }

  if (values.message.trim().length > 2000) {
    errors.message = 'Ez túl hosszú. Foglald össze legfeljebb 2000 karakterben.';
  }

  if (!values.consent) {
    errors.consent = 'A kapcsolatfelvételhez el kell fogadnod az adatkezelési tájékoztatót.';
  }

  return errors;
}

export const emptyForm: FormValues = {
  name: '',
  phone: '',
  email: '',
  city: '',
  service: '',
  message: '',
  consent: false,
};
