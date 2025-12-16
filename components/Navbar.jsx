"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { LayoutDashboard, Boxes, FolderKanban, LogOut } from "lucide-react";
import styles from "../css/Navbar.module.css";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({ active = "dashboard" }) {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  const pathParts = pathname.split("/");
  const projectId = pathParts[2] || null;

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <>
      <aside className={styles.navbar}>
        {/* LOGO */}
        <div className={styles.brandWrap}>
          <Image src="/TIMP.png" alt="TIMP" width={110} height={36} priority />
          <div className={styles.logoGlow}></div>
        </div>

        {/* MENU */}
        <ul className={styles.menu}>
          <li className={styles.item}>
            <Link href="/proyectos" className={styles.link}>
              <div className={styles.icon}><FolderKanban size={18} /></div>
              <span className={styles.label}>Proyectos</span>
            </Link>
          </li>

          <li className={`${styles.item} ${active === "dashboard" ? styles.active : ""}`}>
            <Link
              href={projectId ? `/dashboard/${projectId}` : "/proyectos"}
              className={styles.link}
            >
              <div className={styles.icon}><LayoutDashboard size={18} /></div>
              <span className={styles.label}>Dashboard</span>
            </Link>
          </li>

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
        <div className={styles.user} ref={menuRef}>
          <div className={styles.userMain} onClick={() => setShowMenu(!showMenu)}>
            <img src="/user.png" className={styles.avatar} />
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user ? `${user.nombre} ${user.primerApellido}` : "Usuario"}
              </div>
              <div className={styles.userEmail}>
                {user?.email || "correo@desconocido.com"}
              </div>
            </div>
          </div>

          {showMenu && (
            <div className={styles.dropdown}>
              <button
                className={styles.logoutBtn}
                onClick={() => {
                  setShowMenu(false);
                  setShowLogoutModal(true);
                }}
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 🔥 MODAL DE CONFIRMACIÓN */}
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Cerrar sesión</h3>
            <p className={styles.modalText}>
              ¿Estás seguro de que deseas cerrar sesión?
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button className={styles.confirmBtn} onClick={confirmLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
