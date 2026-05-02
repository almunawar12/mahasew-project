"use server";

import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  projectId: string;
  rating: number;
  comment?: string;
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  if (data.rating < 1 || data.rating > 5) throw new Error("Rating 1-5.");

  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    include: { bids: { where: { status: "ACCEPTED" } } },
  });
  if (!project) throw new Error("Project tidak ditemukan");
  if (project.status !== "COMPLETED") throw new Error("Hanya proyek selesai yang bisa direview.");

  const acceptedBid = project.bids[0];
  if (!acceptedBid) throw new Error("Tak ada freelancer terkait.");

  let toId: string;
  if (session.user.id === project.clientId) {
    toId = acceptedBid.userId;
  } else if (session.user.id === acceptedBid.userId) {
    toId = project.clientId;
  } else {
    throw new Error("Anda tak terlibat di proyek ini.");
  }

  const existing = await prisma.review.findFirst({
    where: { projectId: data.projectId, fromId: session.user.id! },
  });
  if (existing) throw new Error("Review sudah dikirim.");

  const review = await prisma.review.create({
    data: {
      projectId: data.projectId,
      rating: data.rating,
      comment: data.comment || null,
      fromId: session.user.id!,
      toId,
    },
  });

  revalidatePath(`/proyek/${data.projectId}`);
  revalidatePath(`/dashboard/my-applications`);
  revalidatePath(`/dashboard/manage-projects`);
  revalidatePath(`/profil/${toId}`);
  return { success: true, review };
}

export async function getReviewsForUser(userId: string) {
  return prisma.review.findMany({
    where: { toId: userId },
    include: {
      fromUser: { select: { id: true, name: true, image: true } },
      project: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReviewsForProject(projectId: string) {
  return prisma.review.findMany({
    where: { projectId },
    include: {
      fromUser: { select: { id: true, name: true, image: true } },
      toUser: { select: { id: true, name: true } },
    },
  });
}

export async function getUserRatingSummary(userId: string) {
  const agg = await prisma.review.aggregate({
    where: { toId: userId },
    _avg: { rating: true },
    _count: true,
  });
  return {
    avgRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
    totalReviews: agg._count,
  };
}

export async function hasReviewedProject(projectId: string) {
  const session = await auth();
  if (!session) return false;
  const r = await prisma.review.findFirst({
    where: { projectId, fromId: session.user.id! },
  });
  return !!r;
}
