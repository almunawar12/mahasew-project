"use server";

import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { uploadToBucket, BUCKET_KTM } from "@/lib/supabase";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function submitVerification(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "USER") {
    throw new Error("Unauthorized: Only Students can submit verification.");
  }

  const file = formData.get("ktm") as File | null;
  if (!file) throw new Error("File KTM wajib diunggah.");
  if (file.size > MAX_SIZE) throw new Error("Ukuran file maks 5MB.");
  if (!ALLOWED.includes(file.type)) throw new Error("Format file tidak didukung.");

  const ext = file.name.split(".").pop() || "bin";
  const path = `${session.user.id}/ktm-${Date.now()}.${ext}`;
  const url = await uploadToBucket(BUCKET_KTM, path, file, file.type);

  await prisma.profile.upsert({
    where: { userId: session.user.id! },
    create: {
      userId: session.user.id!,
      ktmUrl: url,
      verificationStatus: "PENDING",
      verificationNote: null,
    },
    update: {
      ktmUrl: url,
      verificationStatus: "PENDING",
      verificationNote: null,
    },
  });

  revalidatePath("/dashboard/verification");
  revalidatePath("/admin/verifications");
  return { success: true };
}

export async function getMyVerification() {
  const session = await auth();
  if (!session) return null;
  return prisma.profile.findUnique({
    where: { userId: session.user.id! },
    select: { verificationStatus: true, ktmUrl: true, verificationNote: true },
  });
}

export async function getPendingVerifications() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.profile.findMany({
    where: { verificationStatus: "PENDING" },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
    orderBy: { updatedAt: "asc" },
  });
}

export async function approveVerification(userId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction([
    prisma.profile.update({
      where: { userId },
      data: { verificationStatus: "VERIFIED", verificationNote: null },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    }),
  ]);

  revalidatePath("/admin/verifications");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function rejectVerification(userId: string, note: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  if (!note || note.trim().length < 5) {
    throw new Error("Alasan penolakan wajib diisi (min 5 karakter).");
  }

  await prisma.$transaction([
    prisma.profile.update({
      where: { userId },
      data: { verificationStatus: "REJECTED", verificationNote: note },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { isVerified: false },
    }),
  ]);

  revalidatePath("/admin/verifications");
  return { success: true };
}
