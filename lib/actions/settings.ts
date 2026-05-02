"use server";

import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getPlatformSettings() {
  const settings = await prisma.platformSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
  return settings;
}

export async function updatePlatformSettings(data: {
  commissionPct: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (data.commissionPct < 0 || data.commissionPct > 100) {
    throw new Error("Komisi harus 0-100%.");
  }

  const updated = await prisma.platformSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });

  revalidatePath("/admin/settings");
  return { success: true, settings: updated };
}
