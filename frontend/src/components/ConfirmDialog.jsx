import { Dialog } from "./Dialog.jsx";
import { Button } from "./Button.jsx";

export function ConfirmDialog({
  open,
  title = "Confirmar remoção",
  onClose,
  onConfirm,
  children,
}) {
  return (
    <Dialog open={open} title={title} onClose={onClose} hideWhenClosed>
      <p>{children || "Esta ação não pode ser desfeita."}</p>
      <div className="dialog__actions">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remover
        </Button>
      </div>
    </Dialog>
  );
}
