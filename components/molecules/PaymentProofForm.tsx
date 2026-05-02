"use client";

import React, { useState } from "react";
import { uploadPaymentProof } from "@/lib/actions/payment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const PaymentProofForm = ({ projectId, paymentId }: { projectId: string; paymentId: string }) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Pilih file dulu.");
    setLoading(true);
    const fd = new FormData();
    fd.append("proof", file);
    try {
      await uploadPaymentProof(paymentId, projectId, fd);
      toast.success("Bukti dikirim. Menunggu verifikasi.");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-4">
      <label className="block text-sm font-bold text-on-surface">
        Unggah Bukti Transfer (JPG/PNG/PDF, maks 10MB)
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm border border-outline-variant rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-bold"
      />
      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? "Mengunggah..." : "Kirim Bukti Transfer"}
      </button>
    </form>
  );
};
