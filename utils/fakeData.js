// /utils/fakeData.js

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Datos para las barras horizontales de materiales
export const generateMaterialsData = () => {
  const materials = [
    "Ductos", "Cámaras de inspección", "Costas de advertencia", "Arena",
    "Conectores y coples de ducto", "Tapones o sellos de ducto",
    "Hilos / guías pescables", "Concreto"
  ];
  return materials.map(name => ({
    name,
    existencias: getRandomInt(0, 100),
    minimo: getRandomInt(0, 50),
  }));
};

// Datos para el progreso circular (Avance del Proyecto)
export const generateOverallProgress = () => getRandomInt(70, 95);

// Datos para el gráfico de área (materiales a lo largo del tiempo)
export const generateAreaChartData = () => {
  const data = [];
  for (let i = 0; i < 12; i++) {
    data.push({
      name: `Pt ${i + 1}`,
      Ductos: getRandomInt(20, 90),
      Arena: getRandomInt(10, 80),
      Concreto: getRandomInt(5, 70),
    });
  }
  return data;
};

// Datos para el gráfico de barras verticales (materiales específicos)
export const generateBarChartData = () => {
  const materials = [
    "Ductos", "Cámaras", "Arena", "Coples", "Sellos", "Hilos", "Concreto", "Grava"
  ];
  return materials.map(name => ({
    name,
    cantidad: getRandomInt(20, 100),
  }));
};

// Datos para el gráfico de barras de Reportes con Avance del Proyecto
export const generateProjectReportsData = () => {
  const activities = [
    "Canalización", "Instalación de ductos", "Relleno", "Registro",
    "Perforación direccional", "Prueba de alta y hermeticidad",
    "Inserción de F.O.", "Empalmes", "Pruebas ópticas"
  ];
  return activities.map(name => ({
    name,
    progreso: getRandomInt(30, 95),
  }));
};

// Datos para el gráfico de dona de Avance Estimado vs Realidad
export const generateEstimatedVsRealityData = () => {
  const estimado = getRandomInt(150, 200);
  const realidad = getRandomInt(100, 180);
  return { estimado, realidad };
};