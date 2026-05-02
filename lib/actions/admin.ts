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

  const [totalUsers, totalProjects, totalBids, verifiedUsers, pendingProjects, pendingVerifications, pendingPayments, completedProjects, totalCommission] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.bid.count(),
    prisma.user.count({ where: { isVerified: true } }),
    prisma.project.count({ where: { status: "OPEN" } }),
    prisma.profile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.payment.count({ where: { status: "AWAITING_VERIFICATION" } }),
    prisma.project.count({ where: { status: "COMPLETED" } }),
    prisma.payment.aggregate({ where: { status: "RELEASED" }, _sum: { platformCut: true } }),
  ]);

  return {
    totalUsers,
    totalProjects,
    totalBids,
    verifiedUsers,
    pendingProjects,
    pendingVerifications,
    pendingPayments,
    completedProjects,
    totalCommissionEarned: totalCommission._sum.platformCut || 0,
  };
}

export async function getRecentActivity() {
  await validateAdmin();

  const [recentUsers, recentProjects, recentBids, recentCompleted, recentPayments] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, createdAt: true, client: { select: { name: true } } },
    }),
    prisma.bid.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } },
        project: { select: { title: true, id: true } },
      },
    }),
    prisma.project.findMany({
      where: { status: "COMPLETED" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.payment.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { project: { select: { title: true } } },
    }),
  ]);

  type Activity = { type: string; title: string; description: string; time: Date };
  const items: Activity[] = [];

  recentUsers.forEach((u) => items.push({
    type: "user",
    title: "Pengguna Baru",
    description: `${u.name || u.email} mendaftar sebagai ${u.role}`,
    time: u.createdAt,
  }));
  recentProjects.forEach((p) => items.push({
    type: "project",
    title: "Proyek Baru",
    description: `${p.client.name || "Client"} memposting "${p.title}"`,
    time: p.createdAt,
  }));
  recentBids.forEach((b) => items.push({
    type: "bid",
    title: "Lamaran Baru",
    description: `${b.user.name || "Mahasiswa"} melamar "${b.project.title}"`,
    time: b.createdAt,
  }));
  recentCompleted.forEach((p) => items.push({
    type: "completed",
    title: "Proyek Selesai",
    description: `"${p.title}" ditandai selesai`,
    time: p.updatedAt,
  }));
  recentPayments.forEach((p) => items.push({
    type: "payment",
    title: `Pembayaran ${p.status}`,
    description: `${p.project.title}`,
    time: p.updatedAt,
  }));

  return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);
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
