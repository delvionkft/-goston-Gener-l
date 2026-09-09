import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import './Button.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark';
type Size = 'md' | 'lg';

interface Common {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Balra kerülő ikon. Dekoratív — aria-hidden. */
  icon?: ReactNode;
  fullWidth?: boolean;
}

type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type LinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

function classes(variant: Variant, size: Size, fullWidth: boolean, extra?: string) {
  return [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Egységes gomb. `as="a"` esetén valódi linkként renderel, hogy a
 * `tel:` és `mailto:` hivatkozások natívan működjenek (új fülön nyitás,
 * link másolása, képernyőolvasó „link” szerep).
 */
export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    icon,
    children,
  } = props;

  const cls = classes(variant, size, fullWidth, className);

  if (props.as === 'a') {
    const { as: _as, variant: _v, size: _s, fullWidth: _f, icon: _i, className: _c, children: _ch, ...rest } = props;
    return (
      <a className={cls} {...rest}>
        {icon ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
        <span className="btn__label">{children}</span>
      </a>
    );
  }

  const { as: _as, variant: _v, size: _s, fullWidth: _f, icon: _i, className: _c, children: _ch, ...rest } = props;
  return (
    <button type="button" className={cls} {...rest}>
      {icon ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
      <span className="btn__label">{children}</span>
    </button>
  );
}
