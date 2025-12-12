"use client";

import { useState, useEffect } from "react";
import styles from "../../css/about.module.css";

export default function About() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sobre Mi Trabajo en Instalación de Fibra Óptica</h1>

      <p className={`${styles.content} ${visible ? styles.visible : ""}`}>
        Soy técnico especializado en la instalación y mantenimiento de redes de fibra óptica, 
        garantizando la máxima velocidad y calidad en la transmisión de datos. Mi trabajo consiste 
        en realizar el tendido de cables de fibra, conectarlos correctamente a los equipos y realizar 
        pruebas rigurosas para asegurar que la red funcione sin interrupciones.
      </p>

      <p className={`${styles.content} ${visible ? styles.visible : ""}`} style={{ transitionDelay: "0.3s" }}>
        Manejo herramientas y equipos especializados para la fusión y empalme de fibras ópticas, 
        así como dispositivos para medir la atenuación y pérdida de señal. Además, coordino con 
        los clientes para entender sus necesidades y brindar soluciones personalizadas y eficientes.
      </p>

      <div className={styles.formWrapper}>
        <h2>Contacto</h2>
        <form className={styles.form}>
          <input type="text" placeholder="Nombre completo" required />
          <input type="email" placeholder="Correo electrónico" required />
          <textarea placeholder="Mensaje" rows="4" required></textarea>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}
