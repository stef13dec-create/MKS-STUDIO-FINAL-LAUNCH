import ProjectDetailClient from "./ProjectDetailClient";
import { projects } from "@/lib/data";

export function generateStaticParams() {
  const projectIds = projects.map((project) => project.id);
  
  return projectIds.map((id) => ({
    id: id,
  }));
}

// Ensure the page is treated as static
export const dynamic = "force-static";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return <ProjectDetailClient id={id} />;
}
