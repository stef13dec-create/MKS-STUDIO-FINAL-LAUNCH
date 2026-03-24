import ProjectDetailClient from "./ProjectDetailClient";

export function generateStaticParams() {
  // These IDs were extracted from the current Firestore database
  const projectIds = ["brasov-retreat", "bucharest-hq", "cluj-office", "timisoara-hub"];
  
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
