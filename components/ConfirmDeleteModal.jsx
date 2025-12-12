"use client";

import { useState } from "react";
import styles from "@/css/confirmDelete.module.css";
import { X } from "lucide-react";

export default function ConfirmDeleteModal({ open, onClose, material, onConfirm }) {
  if (!open) return null;

  const [input, setInput] = useState("");

  const handleDelete = () => {
    if (input !== material.nombre) {
      alert("❌ El nombre no coincide.");
      return;
    }
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>¿Eliminar este material?</h2>

        <p className={styles.text}>
          Para confirmar, escribe el nombre del material:
        </p>

        <p className={styles.materialName}>
          <strong>{material.nombre}</strong>
        </p>

        <input
          className={styles.input}
          placeholder="Escribe el nombre EXACTO"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

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
