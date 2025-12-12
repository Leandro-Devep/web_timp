"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Boxes, FolderKanban } from "lucide-react";
import styles from "../css/Navbar.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar({ active = "dashboard" }) {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // -------------------------------------
  // 📌 OBTENER ID DEL PROYECTO DESDE LA URL
  // -------------------------------------
  const pathParts = pathname.split("/");
  const projectId = pathParts[2] || null;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("userData");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } catch (err) {
      console.error("Error leyendo userData:", err);
    }
  }, []);

  return (
    <aside className={styles.navbar}>

      {/* LOGO */}
      <div className={styles.brandWrap}>
        <Image src="/TIMP.png" alt="TIMP" width={110} height={36} priority />
        <div className={styles.logoLine}></div>
      </div>

      {/* MENU */}
      <ul className={styles.menu}>

        {/* NUEVO BOTÓN: PROYECTOS */}
        <li className={styles.item}>
          <Link href="/proyectos" className={styles.link}>
            <div className={styles.icon}>
              <FolderKanban size={18} />
            </div>
            <span className={styles.label}>Proyectos</span>
          </Link>
        </li>

        {/* DASHBOARD */}
        <li className={`${styles.item} ${active === "dashboard" ? styles.active : ""}`}>
          <Link
            href={projectId ? `/dashboard/${projectId}` : "/proyectos"}
            className={styles.link}
          >
            <div className={styles.icon}><LayoutDashboard size={18} /></div>
            <span className={styles.label}>Dashboard</span>
          </Link>
        </li>

        {/* ALMACÉN */}
        <li className={`${styles.item} ${active === "almacen" ? styles.active : ""}`}>
          <Link
            href={projectId ? `/almacen/${projectId}` : "/proyectos"}
            className={styles.link}
          >
            <div className={styles.icon}><Boxes size={18} /></div>
            <span className={styles.label}>Almacén</span>
          </Link>
        </li>

      </ul>

      {/* USUARIO */}
      <div className={styles.user}>
        <img src="/user.png" alt="user" className={styles.avatar} />

        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {user ? `${user.nombre} ${user.primerApellido}` : "Usuario"}
          </div>
          <div className={styles.userEmail}>
            {user ? user.email : "correo@desconocido.com"}
          </div>
        </div>
      </div>

    </aside>
  );
}
