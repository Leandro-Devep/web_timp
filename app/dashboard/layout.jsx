"use client";

import Navbar from "@/components/Navbar";
import "@/css/dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Navbar active="dashboard" />

      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}
