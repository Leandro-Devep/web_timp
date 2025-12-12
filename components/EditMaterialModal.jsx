"use client";

import { useEffect, useState } from "react";
import styles from "@/css/editMaterialModal.module.css";

export default function EditMaterialModal({ open, material, onClose, onSaved }) {
  if (!open || !material) return null;

  const [form, setForm] = useState({
    nombre: "",
    cantidad: "",
    unidad: "",
    stockMinimo: "",
    prioridad: "",
    categoria: "",
    subcategoria: "",
    tipo: "",
  });

  const [nuevaFoto, setNuevaFoto] = useState(null);

  useEffect(() => {
    setForm({
      nombre: material.nombre,
      cantidad: material.cantidad,
      unidad: material.unidad,
      stockMinimo: material.stockMinimo,
      prioridad: material.prioridad,
      categoria: material.categoria,
      subcategoria: material.subcategoria,
      tipo: material.tipo,
    });
  }, [material]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const fd = new FormData();

    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (nuevaFoto) fd.append("foto", nuevaFoto);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materiales/${material._id}`, {
      method: "PUT",
      body: fd,
    });

    if (res.ok) {
      onSaved();
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>

      <div className={styles.modal}>

        <button onClick={onClose} className={styles.closeBtn}>✕</button>

        <h2 className={styles.title}>Editar Material</h2>

        {/* NOMBRE */}
        <div className={styles.field}>
          <label className={styles.label}>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} className={styles.input} />
        </div>

        {/* ROW CANTIDAD / UNIDAD / STOCK */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label className={styles.label}>Cantidad</label>
            <input name="cantidad" value={form.cantidad} onChange={handleChange} className={styles.input} />
          </div>

          <div className={styles.col}>
            <label className={styles.label}>Unidad</label>
            <input name="unidad" value={form.unidad} onChange={handleChange} className={styles.input} />
          </div>

          <div className={styles.col}>
            <label className={styles.label}>Stock mínimo</label>
            <input name="stockMinimo" value={form.stockMinimo} onChange={handleChange} className={styles.input} />
          </div>
        </div>

        {/* PRIORIDAD */}
        <div className={styles.field}>
          <label className={styles.label}>Prioridad</label>
          <select name="prioridad" value={form.prioridad} onChange={handleChange} className={styles.select}>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>

        {/* CATEGORÍA */}
        <div className={styles.field}>
          <label className={styles.label}>Categoría</label>
          <input name="categoria" value={form.categoria} onChange={handleChange} className={styles.input} />
        </div>

        {/* SUBCATEGORIA */}
        <div className={styles.field}>
          <label className={styles.label}>Subcategoría</label>
          <input name="subcategoria" value={form.subcategoria} onChange={handleChange} className={styles.input} />
        </div>

        {/* TIPO */}
        <div className={styles.field}>
          <label className={styles.label}>Tipo</label>
          <input name="tipo" value={form.tipo} onChange={handleChange} className={styles.input} />
        </div>

        {/* CAMBIAR FOTO */}
        <div className={styles.field}>
          <label className={styles.label}>Cambiar Foto</label>
          <input type="file" onChange={(e) => setNuevaFoto(e.target.files[0])} />

          {/* PREVIEW */}
          <div className={styles.previewContainer}>
            <img
              src={nuevaFoto ? URL.createObjectURL(nuevaFoto) : material.fotoUrl}
              className={styles.preview}
            />
          </div>
        </div>

        {/* GUARDAR */}
        <button onClick={handleSubmit} className={styles.saveBtn}>
          Guardar Cambios
        </button>

      </div>
    </div>
  );
}
