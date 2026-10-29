import { useEffect, useRef } from "react";

export function Dialog({
  open,
  title,
  onClose,
  children,
  hideWhenClosed = false,
}) {
  const ref = useRef(null);
  const previous = useRef(null);
  useEffect(() => {
    if (open) {
      previous.current = document.activeElement;
      ref.current?.setAttribute("data-open", "true");
      ref.current?.querySelector("button, input, select")?.focus();
    } else {
      ref.current?.setAttribute("data-open", "false");
      previous.current?.focus?.();
    }
  }, [open]);
  function prenderFoco(event) {
    if (event.key !== "Tab") return;
    const elementos = ref.current?.querySelectorAll(
      "button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
    );
    if (!elementos?.length) return;
    const primeiro = elementos[0];
    const ultimo = elementos[elementos.length - 1];
    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault();
      ultimo.focus();
    }
    if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primeiro.focus();
    }
  }
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-hidden={hideWhenClosed && !open ? "true" : undefined}
      onKeyDown={prenderFoco}
      className="dialog"
      data-open={open ? "true" : "false"}
    >
      <div className="dialog__header">
        <h2>{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Fechar">
          ×
        </button>
      </div>
      {children}
    </div>
  );
}
