"use client";

import { useEffect, useState } from "react";
import styles from "@/css/almacenModal.module.css";
import { X, Plus } from "lucide-react";

export default function AddMaterialModal({ open, onClose, onSaved }) {
  if (!open) return null;

  // ================================
  // 🔗 API REAL DE TU BACKEND
  // ================================
  const API_MATERIALES = process.env.NEXT_PUBLIC_API_URL + "/api/materiales";
  const API_CATEGORIAS = process.env.NEXT_PUBLIC_API_URL + "/api/categorias";
  const API_SUBCATEGORIAS = process.env.NEXT_PUBLIC_API_URL + "/api/subcategorias";
  const API_TIPOS = process.env.NEXT_PUBLIC_API_URL + "/api/tipos";

  // ================================
  // FORM DATA
  // ================================
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [prioridad, setPrioridad] = useState("Alta");

  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [tipo, setTipo] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // ================================
  // LISTAS DESDE BACKEND
  // ================================
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [tipos, setTipos] = useState([]);

  // Campos nuevos
  const [newCategoria, setNewCategoria] = useState("");
  const [newSubcategoria, setNewSubcategoria] = useState("");
  const [newTipo, setNewTipo] = useState("");

  // ================================
  // 🔥 CARGAR CONFIGURACIONES
  // ================================
  const fetchConfig = async () => {
    try {
      const [cats, subs, tps] = await Promise.all([
        fetch(API_CATEGORIAS).then((r) => r.json()),
        fetch(API_SUBCATEGORIAS).then((r) => r.json()),
        fetch(API_TIPOS).then((r) => r.json()),
      ]);

      setCategorias(cats);
      setSubcategorias(subs);
      setTipos(tps);
    } catch (e) {
      console.error("Error cargando configuraciones:", e);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // ================================
  // ⭐ PREVIEW IMAGEN
  // ================================
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  // ================================
  // ⭐ GENERAR QR
  // ================================
  const generarQR = () =>
    "QR-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  // ================================
  // ⭐ AGREGAR NUEVA CATEGORÍA
  // ================================
  const agregarCategoria = async () => {
    if (!newCategoria.trim()) return alert("Escribe una categoría");

    const res = await fetch(API_CATEGORIAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: newCategoria }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.msg);

    setCategorias((prev) => [...prev, data.categoria]);
    setCategoria(newCategoria);
    setNewCategoria("");
  };

  // ================================
  // ⭐ AGREGAR NUEVA SUBCATEGORÍA
  // ================================
  const agregarSubcategoria = async () => {
    if (!categoria) return alert("Selecciona una categoría primero");
    if (!newSubcategoria.trim()) return alert("Escribe una subcategoría");

    const res = await fetch(API_SUBCATEGORIAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: newSubcategoria, categoria }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.msg);

    setSubcategorias((prev) => [...prev, data.subcategoria]);
    setSubcategoria(newSubcategoria);
    setNewSubcategoria("");
  };

  // ================================
  // ⭐ AGREGAR NUEVO TIPO
  // ================================
  const agregarTipo = async () => {
    if (!newTipo.trim()) return alert("Escribe un tipo");

    const res = await fetch(API_TIPOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: newTipo }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.msg);

    setTipos((prev) => [...prev, data.tipo]);
    setTipo(newTipo);
    setNewTipo("");
  };

  // ================================
  // 🔥 ENVIAR FORMULARIO
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("nombre", nombre);
    fd.append("cantidad", cantidad);
    fd.append("unidad", unidad);
    fd.append("stockMinimo", stockMinimo);
    fd.append("prioridad", prioridad);
    fd.append("categoria", categoria);
    fd.append("subcategoria", subcategoria);
    fd.append("tipo", tipo);
    fd.append("qr", generarQR());
    fd.append("foto", file);

    const res = await fetch(API_MATERIALES, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (!res.ok) return alert(data.msg);

    alert("Material agregado con éxito");
    onSaved?.();
    onClose();
  };

  // ================================
  // RENDER
  // ================================
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        {/* BOTÓN CERRAR */}
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={22} />
        </button>

        <h2 className={styles.title}>Añadir Nuevo Material</h2>

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* Nombre */}
          <label className={styles.formLabel}>Nombre del Artículo*</label>
          <input
            className={styles.formInput}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          {/* Cantidad / Unidad / Stock */}
          <div className={styles.row3}>
            <div>
              <label className={styles.formLabel}>Cantidad*</label>
              <input
                className={styles.formInput}
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={styles.formLabel}>Unidad*</label>
              <input
                className={styles.formInput}
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={styles.formLabel}>Stock mínimo*</label>
              <input
                className={styles.formInput}
                type="number"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Prioridad */}
          <label className={styles.formLabel}>Prioridad*</label>
          <select
            className={styles.formInput}
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>

          {/* Categoría */}
          <label className={styles.formLabel}>Categoría Principal*</label>
          <div className={styles.row2}>
            <select
              className={styles.formInput}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecciona</option>
              {categorias.map((c) => (
                <option key={c._id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>

            <div className={styles.newBox}>
              <input
                className={styles.formInput}
                placeholder="Nueva categoría"
                value={newCategoria}
                onChange={(e) => setNewCategoria(e.target.value)}
              />
              <button type="button" onClick={agregarCategoria} className={styles.addBtnSmall}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Subcategoría */}
          <label className={styles.formLabel}>Subcategoría*</label>
          <div className={styles.row2}>
            <select
              className={styles.formInput}
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
            >
              <option value="">Selecciona</option>
              {subcategorias
                .filter((s) => s.categoria === categoria)
                .map((s) => (
                  <option key={s._id} value={s.nombre}>{s.nombre}</option>
                ))}
            </select>

            <div className={styles.newBox}>
              <input
                className={styles.formInput}
                placeholder="Nueva subcategoría"
                value={newSubcategoria}
                onChange={(e) => setNewSubcategoria(e.target.value)}
              />
              <button type="button" onClick={agregarSubcategoria} className={styles.addBtnSmall}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Tipo */}
          <label className={styles.formLabel}>Tipo de Artículo*</label>
          <div className={styles.row2}>
            <select
              className={styles.formInput}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecciona</option>
              {tipos.map((t) => (
                <option key={t._id} value={t.nombre}>{t.nombre}</option>
              ))}
            </select>

            <div className={styles.newBox}>
              <input
                className={styles.formInput}
                placeholder="Nuevo tipo"
                value={newTipo}
                onChange={(e) => setNewTipo(e.target.value)}
              />
              <button type="button" onClick={agregarTipo} className={styles.addBtnSmall}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Foto */}
          <label className={styles.formLabel}>Foto*</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className={styles.formInput}
          />

          {preview && (
            <div className={styles.previewBox}>
              <img src={preview} className={styles.previewImage} />
            </div>
          )}

          {/* Botones */}
          <div className={styles.buttons}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              Guardar Artículo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
