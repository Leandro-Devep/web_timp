"use client";

import Navbar from "../../components/Navbar";
import "./layout.css";

export default function AlmacenLayout({ children }) {
  return (
    <div className="almacen-layout">
      <Navbar active="almacen" />
      <main className="almacen-content">
        {children}
      </main>
    </div>
  );
}
