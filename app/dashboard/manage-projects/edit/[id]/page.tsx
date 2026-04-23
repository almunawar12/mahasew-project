import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getProjectById } from "@/lib/actions/project";
import { ProjectForm } from "@/components/organisms/ProjectForm";

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const params = await props.params;
  const id = params.id;

  if (!session || session.user?.role !== "OWNER") {
    redirect("/login");
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  // Ensure the project belongs to the current user
  if (project.clientId !== session.user.id) {
    redirect("/dashboard/manage-projects");
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ProjectForm project={project} />
    </div>
  );
}
