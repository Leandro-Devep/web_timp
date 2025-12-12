import React from "react";
import Link from "next/link";
import styles from "@/css/proyectos.module.css";

const ProjectCard = ({ project }) => {
  const {
    _id,
    nombre,
    kmInicio,
    kmFinal,
    manager,
    ciudadInicio,
    ciudadFinal,
  } = project;

  const totalKm = kmFinal - kmInicio;
  const kmCompleted = Math.floor(totalKm * 0.4); // Ejemplo de progreso actual
  const progress = Math.min(
    100,
    Math.round((kmCompleted / totalKm) * 100)
  );

  return (
    <Link href={`/dashboard/${_id}`} className={styles.projectCard}>
      <div className={styles.projectContent}>
        <p className={styles.projectPrefix}>Proyecto</p>
        <h3 className={styles.projectName}>
          {ciudadInicio} - {ciudadFinal}
        </h3>

        <p className={styles.projectKm}>
          {kmCompleted} / {totalKm} Km
        </p>

        <div className={styles.progressBarBackground}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.managerInfo}>
        <p className={styles.managerLabel}>Project manager :</p>
        <p className={styles.managerName}>{manager}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;
