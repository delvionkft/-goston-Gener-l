import { useRef, type ReactNode } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { CloseIcon } from './Icons';
import './Modal.css';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Alsó gombsor — pl. a süti-beállítások mentése. */
  footer?: ReactNode;
}

/** Akadálymentes modális ablak: fókuszcsapda, Esc, háttérkattintás. */
export function Modal({ title, onClose, children, footer }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true, onClose);

  return (
    <div className="modal" role="presentation">
      <div className="modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="modal__dialog"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-cim"
      >
        <div className="modal__head">
          <h2 id="modal-cim" className="modal__title">
            {title}
          </h2>
          <button type="button" className="modal__close" onClick={onClose}>
            <CloseIcon />
            <span className="visually-hidden">Bezárás</span>
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__foot">{footer}</div> : null}
      </div>
    </div>
  );
}
