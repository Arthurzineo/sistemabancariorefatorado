import { useEffect, useRef } from "react";

export function Dialog({ open, title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else if (ref.current?.open) ref.current.close();
  }, [open]);
  return <dialog ref={ref} onCancel={onClose} className="dialog"><div className="dialog__header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Fechar">×</button></div>{children}</dialog>;
}
