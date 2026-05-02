"use client";

import React, { useTransition } from "react";
import { approveDeliverable } from "@/lib/actions/payment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ApproveDeliverableButton = ({ bidId }: { bidId: string }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (!confirm("Setujui hasil kerja? Setelah disetujui, dana akan diteruskan ke freelancer dan tidak bisa dibatalkan.")) return;
    startTransition(async () => {
      try {
        await approveDeliverable(bidId);
        toast.success("Hasil disetujui. Proyek selesai.");
        router.refresh();
      } catch (e: any) {
        toast.error(e?.message || "Gagal");
      }
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
    >
      {pending ? "Memproses..." : "Setujui Hasil & Selesaikan Proyek"}
    </button>
  );
};
