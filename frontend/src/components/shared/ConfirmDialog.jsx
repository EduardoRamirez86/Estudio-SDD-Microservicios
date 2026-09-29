import React, { useState } from "react";

export function ConfirmDialog({
  isOpen,
  title,
  subtitle,
  icon = "shield",
  badge = "VALIDACIÓN TRANSACCIONAL OBLIGATORIA",
  details = [],
  warningMessage,
  confirmText = "Confirmar Operación",
  cancelText = "Cancelar",
  isDanger = false,
  onConfirm,
  onCancel,
}) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header Institucional */}
        <div className="modal__header confirm-dialog__header">
          <div>
            <span className="confirm-dialog__badge">
              <span className="confirm-dialog__badge-dot" aria-hidden="true" />
              {badge}
            </span>
            <h2 id="dialog-title" className="modal__title" style={{ marginTop: "4px" }}>
              {title}
            </h2>
            {subtitle && <p className="modal__sub">{subtitle}</p>}
          </div>
          <button className="modal__close" onClick={onCancel} aria-label="Cerrar modal de confirmación">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cuerpo con Detalle de Operación */}
        <div className="modal__body confirm-dialog__body">
          {details && details.length > 0 && (
            <div className="confirm-dialog__details-wrap">
              <div className="confirm-dialog__details-title">Resumen de la Transacción</div>
              <div className="confirm-dialog__table">
                {details.map((item, idx) => (
                  <div key={idx} className="confirm-dialog__row">
                    <span className="confirm-dialog__col-label">{item.label}</span>
                    <span className="confirm-dialog__col-val">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warningMessage && (
            <div className={`confirm-dialog__warning${isDanger ? " confirm-dialog__warning--danger" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{warningMessage}</span>
            </div>
          )}
        </div>

        {/* Footer con Acciones Explícitas */}
        <div className="modal__footer confirm-dialog__footer">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            {cancelText}
          </button>
          <button
            type="button"
            className={isDanger ? "btn-danger" : "btn-primary"}
            onClick={handleConfirm}
            disabled={submitting}
            id="dialog-confirm-action"
          >
            {submitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                <span>Procesando...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
