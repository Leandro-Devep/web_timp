  "use client";

  import React, { useEffect, useState, useMemo } from "react";
  import ProjectCard from "@/components/ProjectCard";
  import styles from "@/css/proyectos.module.css";

  export default function ProyectosPage() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const stored = localStorage.getItem("userData");
      if (!stored) {
        console.warn("⚠️ No hay usuario logueado, redirigiendo...");
        window.location.replace("/"); // 🔁 volver al login
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        console.log("👤 Usuario logueado:", parsed);
        setUser(parsed);
      } catch (err) {
        console.error("❌ Error leyendo usuario:", err);
        window.location.replace("/");
      }
    }, []);

    useEffect(() => {
      if (!user) return;

      const fetchProjects = async () => {
        try {
          console.log("📡 Solicitando proyectos...");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proyectos`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });

          if (!res.ok) throw new Error(`Error al obtener proyectos: ${res.status}`);

          const data = await res.json();
          console.log("📦 Proyectos cargados:", data);
          setProjects(data);
        } catch (err) {
          console.error("🔥 Error cargando proyectos:", err);
        } finally {
          setLoading(false);
        }
      };

      setTimeout(fetchProjects, 300);
    }, [user]);

    const filteredProjects = useMemo(() => {
      if (!searchTerm) return projects;
      const lower = searchTerm.toLowerCase();
      return projects.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(lower) ||
          p.manager?.toLowerCase().includes(lower) ||
          p.ciudadInicio?.toLowerCase().includes(lower) ||
          p.ciudadFinal?.toLowerCase().includes(lower)
      );
    }, [projects, searchTerm]);

    if (loading)
      return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando proyectos...</p>;

    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.background}></div>

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Busca el Proyecto..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className={styles.searchIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h1 className={styles.pageTitle}>PROYECTOS</h1>
          </div>

          <div className={styles.logoContainer}>
            <img src="/TIMP.png" alt="Logo TIMP" className={styles.logoTimp} />
            <div className={styles.logoLine}></div>
          </div>
        </header>

        <main className={styles.projectsGrid}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p) => <ProjectCard key={p._id} project={p} />)
          ) : (
            <p className={styles.noResults}>No se encontraron proyectos.</p>
          )}
        </main>
      </div>
    );
  }
