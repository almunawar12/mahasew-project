"use server";

import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { uploadToBucket, BUCKET_PAYMENT, BUCKET_DELIVERABLE } from "@/lib/supabase";
import { getPlatformSettings } from "./settings";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_PROOF = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function getPaymentByProject(projectId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { payment: { include: { bid: { include: { user: true } } } } },
  });
  if (!project) throw new Error("Project not found");

  const isOwner = project.clientId === session.user.id;
  const isFreelancer = project.payment?.bid?.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isFreelancer && !isAdmin) throw new Error("Forbidden");

  return project;
}

export async function uploadPaymentProof(projectId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") throw new Error("Unauthorized");

  const file = formData.get("proof") as File | null;
  if (!file) throw new Error("Bukti transfer wajib diunggah.");
  if (file.size > MAX_SIZE) throw new Error("Ukuran maks 10MB.");
  if (!ALLOWED_PROOF.includes(file.type)) throw new Error("Format tidak didukung.");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { payment: true },
  });
  if (!project || project.clientId !== session.user.id) throw new Error("Forbidden");
  if (!project.payment) throw new Error("Belum ada bid yang diterima untuk proyek ini.");
  if (project.payment.status === "FUNDED" || project.payment.status === "RELEASED") {
    throw new Error("Pembayaran sudah diverifikasi.");
  }

  const ext = file.name.split(".").pop() || "bin";
  const path = `${projectId}/proof-${Date.now()}.${ext}`;
  const url = await uploadToBucket(BUCKET_PAYMENT, path, file, file.type);

  await prisma.payment.update({
    where: { projectId },
    data: { proofUrl: url, status: "AWAITING_VERIFICATION", notes: null },
  });

  revalidatePath(`/dashboard/manage-projects`);
  revalidatePath(`/admin/payments`);
  return { success: true };
}

export async function getPendingPayments() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized");

  return prisma.payment.findMany({
    where: { status: { in: ["AWAITING_VERIFICATION", "FUNDED", "RELEASED"] } },
    include: {
      project: { select: { id: true, title: true, clientId: true, client: { select: { name: true, email: true } } } },
      bid: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function verifyPayment(paymentId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new Error("Payment tidak ditemukan");
  if (payment.status !== "AWAITING_VERIFICATION") {
    throw new Error("Status payment tidak valid utk verifikasi.");
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: "FUNDED", verifiedById: session.user.id! },
    }),
    prisma.bid.update({
      where: { id: payment.bidId! },
      data: { contractStatus: "ACTIVE" },
    }),
    prisma.project.update({
      where: { id: payment.projectId },
      data: { status: "IN_PROGRESS" },
    }),
  ]);

  revalidatePath("/admin/payments");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function rejectPayment(paymentId: string, reason: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized");
  if (!reason || reason.trim().length < 5) throw new Error("Alasan wajib diisi.");

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "REJECTED", notes: reason },
  });

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function uploadDeliverable(bidId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "USER") throw new Error("Unauthorized");

  const file = formData.get("file") as File | null;
  const note = (formData.get("note") as string) || null;
  if (!file) throw new Error("File deliverable wajib diunggah.");
  if (file.size > MAX_SIZE) throw new Error("Ukuran maks 10MB.");

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { payment: true },
  });
  if (!bid || bid.userId !== session.user.id) throw new Error("Forbidden");
  if (bid.contractStatus !== "ACTIVE" && bid.contractStatus !== "DELIVERED") {
    throw new Error("Kontrak belum aktif atau sudah selesai.");
  }

  const ext = file.name.split(".").pop() || "bin";
  const path = `${bidId}/deliverable-${Date.now()}.${ext}`;
  const url = await uploadToBucket(BUCKET_DELIVERABLE, path, file, file.type);

  await prisma.$transaction([
    prisma.deliverable.create({
      data: { bidId, fileUrl: url, note },
    }),
    prisma.bid.update({
      where: { id: bidId },
      data: { contractStatus: "DELIVERED" },
    }),
  ]);

  revalidatePath("/dashboard/my-applications");
  revalidatePath("/dashboard/manage-projects");
  return { success: true };
}

export async function approveDeliverable(bidId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") throw new Error("Unauthorized");

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { project: true, payment: true },
  });
  if (!bid || bid.project.clientId !== session.user.id) throw new Error("Forbidden");
  if (bid.contractStatus !== "DELIVERED") throw new Error("Belum ada deliverable.");

  await prisma.$transaction([
    prisma.bid.update({
      where: { id: bidId },
      data: { contractStatus: "COMPLETED" },
    }),
    prisma.project.update({
      where: { id: bid.projectId },
      data: { status: "COMPLETED" },
    }),
    prisma.deliverable.updateMany({
      where: { bidId },
      data: { approved: true },
    }),
  ]);

  revalidatePath("/dashboard/manage-projects");
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function releasePayout(paymentId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const file = formData.get("proof") as File | null;
  if (!file) throw new Error("Bukti payout wajib diunggah.");
  if (file.size > MAX_SIZE) throw new Error("Ukuran maks 10MB.");

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { bid: true },
  });
  if (!payment) throw new Error("Payment tidak ditemukan");
  if (payment.status !== "FUNDED") throw new Error("Payment harus FUNDED dulu.");
  if (payment.bid?.contractStatus !== "COMPLETED") {
    throw new Error("Project harus selesai sebelum payout.");
  }

  const ext = file.name.split(".").pop() || "bin";
  const path = `${payment.projectId}/payout-${Date.now()}.${ext}`;
  const url = await uploadToBucket(BUCKET_PAYMENT, path, file, file.type);

  await prisma.payment.update({
    where: { id: paymentId },
    data: { payoutProofUrl: url, status: "RELEASED" },
  });

  revalidatePath("/admin/payments");
  revalidatePath("/dashboard/my-applications");
  revalidatePath(`/dashboard/my-applications/${payment.bidId}`);
  return { success: true };
}

export async function computeCommission(amount: number) {
  const settings = await getPlatformSettings();
  const platformCut = (amount * settings.commissionPct) / 100;
  const freelancerCut = amount - platformCut;
  return { commissionPct: settings.commissionPct, platformCut, freelancerCut };
}
