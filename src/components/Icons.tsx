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

/* --- Szolgáltatásikonok ---------------------------------------------------
   Visszafogott, geometrikus vonalas ikonok. Nem illusztrációk és nem
   hangulatjelek: a kártya jelentését a címe hordozza, az ikon csak
   vizuális horgony. */

export const WindowIcon = () => (
  <svg {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
    <path d="M12 3.5v17M3.5 12h17" />
  </svg>
);

export const DoorIcon = () => (
  <svg {...base}>
    <path d="M5.5 20.5V4.8c0-.7.5-1.2 1.2-1.3l9-1a1.2 1.2 0 0 1 1.3 1.2v16.8M3.5 20.5h17" />
    <circle cx="14.2" cy="12.4" r=".9" />
  </svg>
);

export const ShutterIcon = () => (
  <svg {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
    <path d="M3.5 8h17M3.5 12h17M3.5 16h17" />
  </svg>
);

export const MeshIcon = () => (
  <svg {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
    <path d="M8.5 3.5v17M13.5 3.5v17M3.5 8.5h17M3.5 13.5h17" strokeWidth="1.1" />
  </svg>
);

export const SillIcon = () => (
  <svg {...base}>
    <path d="M6 3.5h12v10H6zM3 16.5h18M3 16.5l1.6 3.5M21 16.5l-1.6 3.5" />
  </svg>
);

export const InstallIcon = () => (
  <svg {...base}>
    <path d="M14.4 3.6a4.2 4.2 0 0 0-5.6 5l-5 5a1.6 1.6 0 0 0 0 2.3l.3.3a1.6 1.6 0 0 0 2.3 0l5-5a4.2 4.2 0 0 0 5-5.6l-2.3 2.3-2.1-.4-.4-2.1Z" />
    <path d="m14.5 14.5 4.6 4.6" />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg {...base}>
    <path d="m5.5 9 6.5 6.5L18.5 9" />
  </svg>
);

export const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M9.2 5.5c-3 1.5-4.7 4-4.7 7.4v5.6h6.1v-6H7.3c0-1.9.9-3.3 2.8-4.4l-.9-2.6Zm9.1 0c-3 1.5-4.7 4-4.7 7.4v5.6h6.1v-6h-3.3c0-1.9.9-3.3 2.8-4.4l-.9-2.6Z" />
  </svg>
);
