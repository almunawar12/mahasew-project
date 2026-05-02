"use server";

import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getMyProfile() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id! },
  });
  return profile;
}

export interface ProfileInput {
  fullName?: string;
  bio?: string;
  university?: string;
  phoneNumber?: string;
  skills?: string[];
  portfolioUrl?: string;
  avatarUrl?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  ewalletProvider?: string;
  ewalletNumber?: string;
}

export async function updateProfile(data: ProfileInput) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const cleaned: ProfileInput = {
    fullName: data.fullName?.trim() || null as any,
    bio: data.bio?.trim() || null as any,
    university: data.university?.trim() || null as any,
    phoneNumber: data.phoneNumber?.trim() || null as any,
    skills: data.skills?.map((s) => s.trim()).filter(Boolean) || [],
    portfolioUrl: data.portfolioUrl?.trim() || null as any,
    avatarUrl: data.avatarUrl?.trim() || null as any,
    bankName: data.bankName?.trim() || null as any,
    bankAccountNumber: data.bankAccountNumber?.trim() || null as any,
    bankAccountName: data.bankAccountName?.trim() || null as any,
    ewalletProvider: data.ewalletProvider?.trim() || null as any,
    ewalletNumber: data.ewalletNumber?.trim() || null as any,
  };

  await prisma.profile.upsert({
    where: { userId: session.user.id! },
    create: { userId: session.user.id!, ...(cleaned as any) },
    update: cleaned as any,
  });

  if (cleaned.fullName) {
    await prisma.user.update({
      where: { id: session.user.id! },
      data: { name: cleaned.fullName },
    });
  }

  revalidatePath("/dashboard/profile");
  revalidatePath(`/profil/${session.user.id}`);
  return { success: true };
}
