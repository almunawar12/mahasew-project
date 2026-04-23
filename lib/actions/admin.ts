"use server";

import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Validates that the current user is an ADMIN.
 */
async function validateAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

export async function getAdminStats() {
  await validateAdmin();

  const [totalUsers, totalProjects, totalBids, verifiedUsers] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.bid.count(),
    prisma.user.count({ where: { isVerified: true } }),
  ]);

  const pendingProjects = await prisma.project.count({ where: { status: "OPEN" } });

  return {
    totalUsers,
    totalProjects,
    totalBids,
    verifiedUsers,
    pendingProjects,
  };
}

export async function getAllUsers() {
  await validateAdmin();

  const users = await prisma.user.findMany({
    include: {
      profile: true,
      _count: {
        select: {
          projects: true,
          bids: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

export async function toggleUserVerification(userId: string) {
  await validateAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: !user.isVerified,
    },
  });

  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
  
  return { success: true, isVerified: updatedUser.isVerified };
}

export async function getAllProjectsAdmin() {
  await validateAdmin();

  const projects = await prisma.project.findMany({
    include: {
      client: {
        select: {
          name: true,
          email: true,
        }
      },
      _count: {
        select: {
          bids: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export async function deleteProjectAdmin(id: string) {
  await validateAdmin();

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/dashboard");
  revalidatePath("/cari-proyek");
  
  return { success: true };
}
