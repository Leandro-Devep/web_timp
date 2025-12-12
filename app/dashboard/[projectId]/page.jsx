import { use } from "react";
import Dashboard from "@/components/Dashboard";

export default function ProjectDashboardPage({ params }) {
  // params ahora es una Promesa en Next 15
  const { projectId } = use(params);

  return <Dashboard projectId={projectId} />;
}
