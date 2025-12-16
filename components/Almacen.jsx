"use client";

import { useEffect, useState } from "react";
import styles from "../css/almacen.module.css";

import AddMaterialModal from "./AddMaterialModal";
import EditMaterialModal from "./EditMaterialModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import { Plus, Search, Trash2, Edit, ChevronDown } from "lucide-react";

export default function Almacen() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/materiales`;

  const [search, setSearch] = useState("");
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODALES
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  // FILTROS
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("Todas");

  // DROPDOWNS
  const [openTipo, setOpenTipo] = useState(false);
  const [openPrioridad, setOpenPrioridad] = useState(false);
  const [openSubcategoria, setOpenSubcategoria] = useState(false);

  // ================================
  // OBTENER MATERIALES
  // ================================
  const fetchMateriales = async () => {
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      const data = await res.json();
      setMateriales(data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando materiales:", error);
    }
  };

  useEffect(() => {
    fetchMateriales();
  }, []);

  // ================================
  // DROPDOWNS FLOTANTES
  // ================================
  const openDropdown = (event, setter) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();

    document.documentElement.style.setProperty("--dropdown-x", rect.left + "px");
    document.documentElement.style.setProperty("--dropdown-y", rect.bottom + 8 + "px");

    setOpenTipo(false);
    setOpenPrioridad(false);
    setOpenSubcategoria(false);

    setter(true);
  };

  useEffect(() => {
    const closeAll = () => {
      setOpenTipo(false);
      setOpenPrioridad(false);
      setOpenSubcategoria(false);
    };
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  // ================================
  // AGRUPAR POR CATEGORÍA
  // ================================
  const groupByCategoria = () => {
    const grupo = {};
    materiales.forEach((mat) => {
      if (!grupo[mat.categoria]) grupo[mat.categoria] = {};
      if (!grupo[mat.categoria][mat.subcategoria])
        grupo[mat.categoria][mat.subcategoria] = [];
      grupo[mat.categoria][mat.subcategoria].push(mat);
    });
    return grupo;
  };

  const groupedData = groupByCategoria();

  // ================================
  // FILTROS
  // ================================
  const filtrarMateriales = (lista) =>
    lista.filter((m) => {
      const pasaTipo = filtroTipo === "Todos" || m.tipo === filtroTipo;
      const pasaPrioridad =
        filtroPrioridad === "Todas" || m.prioridad === filtroPrioridad;
      const pasaSub =
        filtroSubcategoria === "Todas" || m.subcategoria === filtroSubcategoria;
      const pasaNombre = m.nombre.toLowerCase().includes(search.toLowerCase());

      return pasaTipo && pasaPrioridad && pasaSub && pasaNombre;
    });

  // ================================
  // ELIMINAR MATERIAL (REAL)
  // ================================
  const eliminarMaterial = async () => {
    if (!materialToDelete) return;

    try {
      const res = await fetch(`${API_URL}/${materialToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchMateriales();
      }
    } catch (err) {
      console.error("Error eliminando material:", err);
    } finally {
      setDeleteModalOpen(false);
      setMaterialToDelete(null);
    }
  };

  if (loading) return <p>Cargando...</p>;

  const tipos = [...new Set(materiales.map((m) => m.tipo))];
  const subcategorias = [...new Set(materiales.map((m) => m.subcategoria))];

  return (
    <>
      <div className={styles.almacenPage}>
        {/* BUSCADOR */}
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            placeholder="Buscar material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTROS */}
        <div className={styles.filters}>
          <button
            className={styles.filterBtn}
            onClick={(e) => openDropdown(e, setOpenTipo)}
          >
            {filtroTipo} <ChevronDown size={16} />
          </button>

          {openTipo && (
            <div className={styles.dropdownMenu}>
              <div onClick={() => setFiltroTipo("Todos")}>Todos</div>
              {tipos.map((t) => (
                <div key={t} onClick={() => setFiltroTipo(t)}>
                  {t}
                </div>
              ))}
            </div>
          )}

          <button
            className={styles.filterBtn}
            onClick={(e) => openDropdown(e, setOpenPrioridad)}
          >
            {filtroPrioridad} <ChevronDown size={16} />
          </button>

          {openPrioridad && (
            <div className={styles.dropdownMenu}>
              {["Todas", "Alta", "Media", "Baja"].map((p) => (
                <div key={p} onClick={() => setFiltroPrioridad(p)}>
                  {p}
                </div>
              ))}
            </div>
          )}

          <button
            className={styles.filterBtn}
            onClick={(e) => openDropdown(e, setOpenSubcategoria)}
          >
            {filtroSubcategoria} <ChevronDown size={16} />
          </button>

          {openSubcategoria && (
            <div className={styles.dropdownMenu}>
              <div onClick={() => setFiltroSubcategoria("Todas")}>Todas</div>
              {subcategorias.map((s) => (
                <div key={s} onClick={() => setFiltroSubcategoria(s)}>
                  {s}
                </div>
              ))}
            </div>
          )}

          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Añadir Material
          </button>
        </div>

        {/* TABLAS */}
        {Object.keys(groupedData).map((categoria) => (
          <div key={categoria}>
            <h2 className={styles.categoryTitle}>{categoria}</h2>

            {Object.keys(groupedData[categoria]).map((sub) => {
              const mats = filtrarMateriales(groupedData[categoria][sub]);
              if (!mats.length) return null;

              return (
                <table key={sub} className={styles.table}>
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Material</th>
                      <th>Stock Min</th>
                      <th>Prioridad</th>
                      <th>Cantidad</th>
                      <th>Tipo</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {mats.map((mat) => (
                      <tr key={mat._id}>
                        <td>
                          <div className={styles.fadeInRow}>
                            <img src={mat.fotoUrl} className={styles.imgThumb} />
                          </div>
                        </td>
                        <td>{mat.nombre}</td>
                        <td>{mat.stockMinimo}</td>
                        <td>
                          <span
                            className={`${styles.priority} ${
                              styles[mat.prioridad.toLowerCase()]
                            }`}
                          >
                            {mat.prioridad}
                          </span>
                        </td>
                        <td>{mat.cantidad}</td>
                        <td>{mat.tipo}</td>
                        <td className={styles.actions}>
                          <button
                            className={styles.delete}
                            onClick={() => {
                              setMaterialToDelete(mat);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            className={styles.update}
                            onClick={() => {
                              setMaterialToEdit(mat);
                              setEditModalOpen(true);
                            }}
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })}
          </div>
        ))}
      </div>

      {/* MODALES */}
      <AddMaterialModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSaved={fetchMateriales}
      />

      <EditMaterialModal
        open={editModalOpen}
        material={materialToEdit}
        onClose={() => setEditModalOpen(false)}
        onSaved={fetchMateriales}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        material={materialToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={eliminarMaterial}
      />
    </>
  );
}
