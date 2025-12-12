import { use } from "react";
import Almacen from "../../../components/Almacen";

export default function AlmacenPage({ params }) {
  const { projectId } = use(params);

  return <Almacen projectId={projectId} />;
}
