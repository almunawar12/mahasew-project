"use server";

import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectStatus } from "@prisma/client";

export async function createProject(formData: {
  title: string;
  description: string;
  budget: number;
  budgetType: string;
  skills: string[];
  deadline?: string;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "OWNER") {
    throw new Error("Unauthorized: Only Owners can post projects.");
  }

  const project = await prisma.project.create({
    data: {
      title: formData.title,
      description: formData.description,
      budget: formData.budget,
      budgetType: formData.budgetType,
      skills: formData.skills,
      deadline: formData.deadline ? new Date(formData.deadline) : null,
      clientId: session.user.id!,
      status: "OPEN",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/manage-projects");
  
  return { success: true, project };
}

export async function deleteProject(id: string) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project || project.clientId !== session.user.id) {
    throw new Error("Unauthorized or project not found");
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/manage-projects");
  
  return { success: true };
}

export async function updateProject(id: string, formData: any) {
    const session = await auth();
  
    if (!session) throw new Error("Unauthorized");
  
    const project = await prisma.project.findUnique({
      where: { id },
    });
  
    if (!project || project.clientId !== session.user.id) {
      throw new Error("Unauthorized or project not found");
    }
  
    await prisma.project.update({
      where: { id },
      data: {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : project.deadline,
      },
    });
  
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/manage-projects");
    
    return { success: true };
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project || project.clientId !== session.user.id) {
    throw new Error("Unauthorized or project not found");
  }

  await prisma.project.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/manage-projects");
  revalidatePath(`/proyek/${id}`);
  
  return { success: true };
}

export async function updateBidStatus(bidId: string, status: "ACCEPTED" | "REJECTED") {
  const session = await auth();

  if (!session || session.user?.role !== "OWNER") {
    throw new Error("Unauthorized");
  }

  // Ensure the bid belongs to a project owned by this user
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: true
    }
  });

  if (!bid || bid.project.clientId !== session.user.id) {
    throw new Error("Unauthorized or bid not found");
  }

  await prisma.bid.update({
    where: { id: bidId },
    data: { status }
  });

  revalidatePath("/dashboard/applicants");
  revalidatePath("/dashboard");
  
  return { success: true };
}

export async function getActiveProjects() {
  const projects = await prisma.project.findMany({
    where: {
      status: "OPEN",
    },
    include: {
      client: {
        include: {
          profile: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return projects;
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          profile: true
        }
      },
      bids: {
        include: {
          user: true
        }
      }
    }
  });

  return project;
}

export async function applyForProject(projectId: string, data: { amount: number; message: string }) {
  const session = await auth();

  if (!session || session.user?.role !== "USER") {
    throw new Error("Unauthorized: Only Students can apply for projects.");
  }

  const existingBid = await prisma.bid.findFirst({
    where: {
      projectId,
      userId: session.user.id!
    }
  });

  if (existingBid) {
    throw new Error("You have already applied for this project.");
  }

  const bid = await prisma.bid.create({
    data: {
      amount: data.amount,
      message: data.message,
      projectId,
      userId: session.user.id!,
      status: "PENDING"
    }
  });

  revalidatePath(`/proyek/${projectId}`);
  revalidatePath("/dashboard/my-applications"); // Assuming this exists or will exist
  
  return { success: true, bid };
}

export async function getUserApplications() {
  const session = await auth();

  if (!session || session.user?.role !== "USER") {
    throw new Error("Unauthorized");
  }

  const applications = await prisma.bid.findMany({
    where: {
      userId: session.user.id!
    },
    include: {
      project: {
        include: {
          client: {
            include: {
              profile: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return applications;
}
