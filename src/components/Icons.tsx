/**
 * Beágyazott SVG ikonok. Szándékosan nincs ikonkönyvtár-függőség:
 * az itt használt néhány ikon így pár száz bájt, nem több tíz kilobájt.
 * Minden ikon dekoratív — a jelentést a mellette lévő szöveg hordozza.
 */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export const PhoneIcon = () => (
  <svg {...base}>
    <path d="M6.6 3.5h-2A1.6 1.6 0 0 0 3 5.2c0 8.7 7.1 15.8 15.8 15.8a1.6 1.6 0 0 0 1.7-1.6v-2a1.3 1.3 0 0 0-1-1.3l-3-.7a1.3 1.3 0 0 0-1.3.5l-.8 1a12.6 12.6 0 0 1-5.6-5.6l1-.8a1.3 1.3 0 0 0 .5-1.3l-.7-3a1.3 1.3 0 0 0-1.3-1Z" />
  </svg>
);

export const MailIcon = () => (
  <svg {...base}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </svg>
);

export const ArrowRightIcon = () => (
  <svg {...base}>
    <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
  </svg>
);

export const ArrowDownIcon = () => (
  <svg {...base}>
    <path d="M12 4v15m0 0 5.5-5.5M12 19l-5.5-5.5" />
  </svg>
);

export const ChevronLeftIcon = () => (
  <svg {...base}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </svg>
);

export const ChevronRightIcon = () => (
  <svg {...base}>
    <path d="M9.5 5.5 16 12l-6.5 6.5" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...base}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const CheckIcon = () => (
  <svg {...base}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const AlertIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.4v.1" />
  </svg>
);

export const MenuIcon = () => (
  <svg {...base}>
    <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
  </svg>
);

export const ExpandIcon = () => (
  <svg {...base}>
    <path d="M9 4.5H4.5V9M15 4.5h4.5V9M9 19.5H4.5V15M15 19.5h4.5V15" />
  </svg>
);

export const PinIcon = () => (
  <svg {...base}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);
