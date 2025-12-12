"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import styles from "../css/dashboard.module.css";
import * as echarts from "echarts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------------------------------------------------
   FIX PREMIUM — Componente reusable seguro para ECharts
--------------------------------------------------------- */
function EChartBox({ option }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 🧹 Limpieza previa segura
    if (chartInstance.current) {
      try {
        if (!chartInstance.current.isDisposed?.()) {
          chartInstance.current.dispose();
        }
      } catch {
        console.warn("Dispose previo falló, continuando…");
      }
    }

    // Inicializar chart nuevo
    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    chart.setOption(option);

    const resize = () => {
      try {
        chartInstance.current?.resize();
      } catch {}
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);

      try {
        if (chartInstance.current && !chartInstance.current.isDisposed?.()) {
          chartInstance.current.dispose();
        }
      } catch {
        console.warn("Error al eliminar gráfica");
      }

      chartInstance.current = null;
    };
  }, [option]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
}

/* ---------------------------------------------------------
   DASHBOARD COMPLETO
--------------------------------------------------------- */
export default function Dashboard({ projectId }) {
  const [materiales, setMateriales] = useState([]);
  const [etapas, setEtapas] = useState({});
  const [meses, setMeses] = useState({});
  const [semanas, setSemanas] = useState({});
  const [estimado, setEstimado] = useState(0);
  const [real, setReal] = useState(0);
  const [avanceGeneral, setAvanceGeneral] = useState(0);

  /* ---------------------------------------------------------
     1. Cargar Dashboard Backend Real
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/${projectId}`
        );

        const data = await res.json();

        setEtapas(data.avanceEtapas || {});
        setMeses(data.avanceMes || {});
        setSemanas(data.avanceSemana || {});
        setEstimado(data.estimado || 0);
        setReal(data.realGlobal || 0);
        setAvanceGeneral(data.realGlobal || 0);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      }
    };

    fetchDashboard();
  }, [projectId]);

  /* ---------------------------------------------------------
     2. Cargar Materiales
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materiales`);
        const data = await res.json();
        setMateriales(data);
      } catch (err) {
        console.error("Error cargando materiales:", err);
      }
    };

    fetchMateriales();
  }, []);

  /* ---------------------------------------------------------
     3. PDF PROFESIONAL
  --------------------------------------------------------- */
  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const fecha = new Date().toLocaleDateString();

    // Portada premium
    doc.setFillColor(10, 25, 61);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("STOCK DE ALMACÉN", 105, 80, { align: "center" });

    doc.setFontSize(16);
    doc.text("Reporte General de Existencias", 105, 100, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 105, 115, { align: "center" });

    doc.addPage();

    const grupos = {};

    materiales.forEach((m) => {
      if (!grupos[m.categoria]) grupos[m.categoria] = {};
      if (!grupos[m.categoria][m.subcategoria])
        grupos[m.categoria][m.subcategoria] = [];

      grupos[m.categoria][m.subcategoria].push(m);
    });

    doc.setFontSize(18);
    doc.setTextColor(20, 20, 20);
    doc.text("Materiales del Almacén", 105, 15, { align: "center" });

    Object.keys(grupos).forEach((categoria) => {
      doc.setFontSize(16);
      doc.setTextColor(0, 70, 140);
      doc.text(categoria, 10, doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 30);

      Object.keys(grupos[categoria]).forEach((sub) => {
        doc.setFontSize(13);
        doc.setTextColor(70, 70, 70);
        doc.text(
          `Subcategoría: ${sub}`,
          10,
          doc.lastAutoTable ? doc.lastAutoTable.finalY + 22 : 40
        );

        const rows = grupos[categoria][sub].map((m) => [
          m.nombre,
          m.tipo,
          m.cantidad,
          m.stockMinimo,
        ]);

        autoTable(doc, {
          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 25 : 45,
          head: [["Material", "Tipo", "Stock Total", "Stock Mínimo"]],
          body: rows,
          theme: "striped",
          headStyles: {
            fillColor: [0, 102, 204],
            textColor: 255,
          },
          alternateRowStyles: { fillColor: [235, 242, 255] },
        });
      });

      doc.addPage();
    });

    doc.save("Stock_de_Almacén.pdf");
  };

  /* ---------------------------------------------------------
     4. MATERIAL PRIORIDAD ALTA
  --------------------------------------------------------- */
  const materialsOption = useMemo(() => {
    const alta = materiales.filter((m) => m.prioridad === "Alta").slice(0, 10);

    if (!alta.length) {
      return {
        title: {
          text: "No hay materiales con prioridad Alta",
          textStyle: { color: "#fff" },
          left: "center",
          top: "center",
        },
      };
    }

    const data = alta.map((m) => ({
      value: m.stockMinimo > 0 ? Math.round((m.cantidad / m.stockMinimo) * 100) : 100,
      name: m.nombre,
      stock: m.cantidad,
      min: m.stockMinimo,
    }));

    return {
      backgroundColor: "transparent",

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0,0,0,0.85)",
        borderColor: "#00E5FF",
        borderWidth: 1,
        textStyle: { color: "#fff", fontSize: 12 },
        formatter: (p) => {
          const d = p[0].data;
          return `
            <b>${d.name}</b><br/>
            Stock total: <b>${d.stock}</b><br/>
            Stock mínimo: <b>${d.min}</b><br/>
            Nivel: <b>${d.value}%</b>
          `;
        },
      },

      grid: { left: 10, right: 20, top: 20, bottom: 10, containLabel: true },

      xAxis: {
        type: "value",
        max: 100,
        axisLabel: { color: "#cfe6ff" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },

      yAxis: {
        type: "category",
        axisLabel: { color: "#ffffff", fontSize: 12 },
        data: data.map((d) => d.name),
      },

      series: [
        {
          type: "bar",
          data,
          barWidth: 18,
          itemStyle: {
            borderRadius: 10,
            color: (p) =>
              p.data.value <= 20
                ? "#ff4d4d"
                : new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#00ffa3" },
                    { offset: 1, color: "#00996b" },
                  ]),
          },
        },
      ],
    };
  }, [materiales]);

  /* ---------------------------------------------------------
     5. Gauge premium sin números ni rayas
  --------------------------------------------------------- */
  const gaugeOption = useMemo(
    () => ({
      backgroundColor: "transparent",

      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 0,

          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [avanceGeneral / 100, "#00F2A2"],
                [1, "rgba(255,255,255,0.12)"],
              ],
            },
          },

          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          anchor: { show: false },
          pointer: { show: false },

          progress: {
            show: true,
            width: 20,
            itemStyle: { color: "#00FFD1" },
          },

          detail: {
            formatter: "{value}%",
            valueAnimation: true,
            color: "#fff",
            fontSize: 32,
            offsetCenter: [0, "-20%"],
          },

          data: [{ value: avanceGeneral }],
        },
      ],
    }),
    [avanceGeneral]
  );

  /* ---------------------------------------------------------
     6. Avance por mes
  --------------------------------------------------------- */
  const mesesOption = useMemo(() => {
    const labels = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

    return {
      backgroundColor: "transparent",

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0,0,0,0.85)",
        borderColor: "#00dfff",
        borderWidth: 1,
        textStyle: { color: "#fff" },
        formatter: (p) =>
          `<b>${p[0].axisValue}</b><br/>Avance: <b>${p[0].data}%</b>`,
      },

      grid: { left: 40, right: 20, top: 30, bottom: 40 },

      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { color: "#cfe6ff" },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.25)" } },
      },

      yAxis: {
        type: "value",
        max: 100,
        axisLabel: { color: "#cfe6ff" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },

      series: [
        {
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 3, color: "#00dfff" },

          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0,207,255,0.35)" },
              { offset: 1, color: "rgba(0,207,255,0)" },
            ]),
          },

          data: labels.map((m) => meses[m] || 0),
        },
      ],
    };
  }, [meses]);

  /* ---------------------------------------------------------
     7. Avance por semana
  --------------------------------------------------------- */
  const semanaOption = useMemo(() => {
    const dias = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];

    return {
      backgroundColor: "transparent",

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0,0,0,0.85)",
        borderColor: "#6ee7ff",
        borderWidth: 1,
        textStyle: { color: "#fff" },
        formatter: (p) =>
          `<b>${p[0].axisValue}</b><br/>Avance: <b>${p[0].data}%</b>`,
      },

      grid: { left: 35, right: 20, top: 25, bottom: 40 },

      xAxis: {
        type: "category",
        data: dias,
        axisLabel: { color: "#cfe6ff" },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.2)" } },
      },

      yAxis: {
        type: "value",
        max: 100,
        axisLabel: { color: "#cfe6ff" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },

      series: [
        {
          type: "bar",
          data: dias.map((d) => semanas[d] || 0),
          barWidth: 22,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#6ee7ff" },
              { offset: 1, color: "#0369a1" },
            ]),
          },
        },
      ],
    };
  }, [semanas]);

  /* ---------------------------------------------------------
     8. Reportes del proyecto
  --------------------------------------------------------- */
  const reportesOption = useMemo(() => {
    const keys = Object.keys(etapas || {});

    return {
      backgroundColor: "transparent",

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0,0,0,0.85)",
        borderColor: "#a855ff",
        borderWidth: 1,
        textStyle: { color: "#fff" },

        formatter: (p) => {
          const etapa = p[0].axisValue;
          const avance = p[0].data;
          const reportes = Math.round(avance / 10); // ejemplo

          return `
            <b>${etapa}</b><br/>
            Avance: <b>${avance}%</b><br/>
            Reportes: <b>${reportes}</b>
          `;
        },
      },

      grid: { left: 40, right: 20, top: 30, bottom: 40 },

      xAxis: {
        type: "category",
        data: keys,
        axisLabel: { color: "#fff", rotate: -30 },
      },

      yAxis: {
        type: "value",
        max: 100,
        axisLabel: { color: "#cfe6ff" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },

      series: [
        {
          type: "bar",
          data: keys.map((k) => etapas[k]),
          barWidth: 18,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#a855ff" },
              { offset: 1, color: "#4c1d95" },
            ]),
          },
        },
      ],
    };
  }, [etapas]);

  /* ---------------------------------------------------------
     9. ESTIMADO VS REAL
  --------------------------------------------------------- */
  const estimadoRealOption = useMemo(
    () => ({
      backgroundColor: "transparent",

      tooltip: {
        show: true,
        backgroundColor: "rgba(0,0,0,0.85)",
        borderColor: "#22c55e",
        borderWidth: 1,
        textStyle: { color: "#fff" },
        formatter: (p) =>
          `<b>${p.name}</b><br/>Cantidad: <b>${p.value}</b><br/>Porcentaje: <b>${p.percent}%</b>`,
      },

      series: [
        {
          type: "pie",
          radius: ["60%", "80%"],
          label: {
            show: true,
            color: "#fff",
            formatter: "{b}: {d}%",
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: "#0d1b3d",
          },
          data: [
            { value: estimado, name: "Estimado", itemStyle: { color: "#00E5FF" } },
            { value: real, name: "Real", itemStyle: { color: "#4DFFB2" } },
          ],
        },
      ],
    }),
    [estimado, real]
  );

  /* ---------------------------------------------------------
     RENDER FINAL DEL DASHBOARD
  --------------------------------------------------------- */
  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardContent}>
        
        {/* FILA 1 */}
        <section className={styles.topSection}>
          
          {/* MATERIALES */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Materiales (Prioridad Alta)</h2>

            <div className={styles.chartBoxTall}>
              <EChartBox option={materialsOption} />
            </div>

            <button className={styles.pdfBtn} onClick={generatePDF}>
              Descargar Stock de Almacén
            </button>
          </article>

          {/* GAUGE */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Avance del Proyecto</h2>
            <div className={styles.chartBoxGauge}>
              <EChartBox option={gaugeOption} />
            </div>
          </article>

        </section>

        {/* FILA 2 */}
        <section className={styles.middleSection}>
          
          {/* MES */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Avance por Mes</h2>
            <div className={styles.chartBox}>
              <EChartBox option={mesesOption} />
            </div>
          </article>

          {/* SEMANA */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Avance por Semana</h2>
            <div className={styles.chartBox}>
              <EChartBox option={semanaOption} />
            </div>
          </article>

        </section>

        {/* FILA 3 */}
        <section className={styles.bottomSection}>
          
          {/* REPORTES */}
          <article className={styles.cardLarge}>
            <h2 className={styles.cardTitle}>Reportes del Proyecto</h2>
            <div className={styles.chartBoxLarge}>
              <EChartBox option={reportesOption} />
            </div>
          </article>

          {/* DONUT */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Estimado vs Real</h2>
            <div className={styles.chartBox}>
              <EChartBox option={estimadoRealOption} />
            </div>
          </article>

        </section>

      </div>
    </div>
  );
}
