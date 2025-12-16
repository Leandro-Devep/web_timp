"use client";

import { useState, useEffect } from "react";
import styles from "../css/confirmDelete.module.css";
import { X } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  material,
  onConfirm,
}) {
  // ✅ Hooks SIEMPRE arriba
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  // 🔄 Reset cuando se abre
  useEffect(() => {
    if (open) {
      setInput("");
      setError(false);
    }
  }, [open]);

  // ⛔ Render condicional DESPUÉS de hooks
  if (!open || !material) return null;

  const handleDelete = () => {
    if (input !== material.nombre) {
      setError(true);
      return;
    }

    onConfirm();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.modal} ${error ? styles.shake : ""}`}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>¿Eliminar este material?</h2>

        <p className={styles.text}>
          Para confirmar, escribe el nombre exacto del material:
        </p>

        <p className={styles.materialName}>
          <strong>{material.nombre}</strong>
        </p>

        <input
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          placeholder="Escribe el nombre EXACTO"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
        />

        {error && (
          <p className={styles.errorText}>
            ❌ El nombre no coincide
          </p>
        )}

        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>

          <button className={styles.deleteBtn} onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
