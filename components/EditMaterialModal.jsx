"use client";

import { useEffect, useState } from "react";
import styles from "../css/editMaterialModal.module.css";

export default function EditMaterialModal({ open, material, onClose, onSaved }) {

  /* ================================
     ESTADOS
  ================================ */
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

  // Listas
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [tipos, setTipos] = useState([]);

  /* ================================
     CARGAR LISTAS DEL BACKEND
  ================================ */
  useEffect(() => {
    if (!open) return;

    const API = process.env.NEXT_PUBLIC_API_URL;

    Promise.all([
      fetch(`${API}/api/categorias`).then(r => r.json()),
      fetch(`${API}/api/subcategorias`).then(r => r.json()),
      fetch(`${API}/api/tipos`).then(r => r.json()),
    ])
      .then(([cats, subs, tps]) => {
        setCategorias(cats);
        setSubcategorias(subs);
        setTipos(tps);
      })
      .catch(err => console.error("Error cargando listas:", err));
  }, [open]);

  /* ================================
     CARGAR MATERIAL A EDITAR
  ================================ */
  useEffect(() => {
    if (!material) return;

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

    setNuevaFoto(null);
  }, [material]);

  /* ================================
     SALIDA SEGURA (DESPUÉS DE HOOKS)
  ================================ */
  if (!open || !material) return null;

  /* ================================
     HANDLERS
  ================================ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (nuevaFoto) fd.append("foto", nuevaFoto);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/materiales/${material._id}`,
      {
        method: "PUT",
        body: fd,
      }
    );

    if (res.ok) {
      onSaved();
      onClose();
    }
  };

  /* ================================
     RENDER
  ================================ */
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>

        <button onClick={onClose} className={styles.closeBtn}>✕</button>

        <h2 className={styles.title}>Editar Material</h2>

        {/* NOMBRE */}
        <div className={styles.field}>
          <label className={styles.label}>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* CANTIDAD / UNIDAD / STOCK */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label className={styles.label}>Cantidad</label>
            <input
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.col}>
            <label className={styles.label}>Unidad</label>
            <input
              name="unidad"
              value={form.unidad}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.col}>
            <label className={styles.label}>Stock mínimo</label>
            <input
              name="stockMinimo"
              value={form.stockMinimo}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        {/* PRIORIDAD */}
        <div className={styles.field}>
          <label className={styles.label}>Prioridad</label>
          <select
            name="prioridad"
            value={form.prioridad}
            onChange={handleChange}
            className={styles.select}
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>

        {/* CATEGORÍA */}
        <div className={styles.field}>
          <label className={styles.label}>Categoría</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className={styles.select}
          >
            {categorias.map((c) => (
              <option key={c._id} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* SUBCATEGORÍA */}
        <div className={styles.field}>
          <label className={styles.label}>Subcategoría</label>
          <select
            name="subcategoria"
            value={form.subcategoria}
            onChange={handleChange}
            className={styles.select}
          >
            {subcategorias
              .filter((s) => s.categoria === form.categoria)
              .map((s) => (
                <option key={s._id} value={s.nombre}>
                  {s.nombre}
                </option>
              ))}
          </select>
        </div>

        {/* TIPO */}
        <div className={styles.field}>
          <label className={styles.label}>Tipo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className={styles.select}
          >
            {tipos.map((t) => (
              <option key={t._id} value={t.nombre}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* FOTO */}
        <div className={styles.field}>
          <label className={styles.label}>Cambiar Foto</label>
          <input type="file" onChange={(e) => setNuevaFoto(e.target.files[0])} />

          <div className={styles.previewContainer}>
            <img
              src={nuevaFoto ? URL.createObjectURL(nuevaFoto) : material.fotoUrl}
              className={styles.preview}
            />
          </div>
        </div>

        <button onClick={handleSubmit} className={styles.saveBtn}>
          Guardar Cambios
        </button>

      </div>
    </div>
  );
}
