"use client";

import React, { useState } from "react";
import { submitVerification } from "@/lib/actions/verification";
import { Icon } from "@/components/atoms/Icon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const VerificationForm = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Pilih file dulu.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("ktm", file);
    try {
      await submitVerification(fd);
      toast.success("Berhasil dikirim. Tunggu review admin.");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengunggah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-4">
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">
          Unggah KTM (JPG/PNG/PDF, maks 5MB)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm border border-outline-variant rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-bold hover:file:brightness-110"
        />
      </div>

      <div className="bg-blue-50 text-blue-800 rounded-xl p-4 text-sm flex gap-2">
        <Icon name="info" className="shrink-0" />
        <p>Pastikan KTM jelas terbaca: nama, NIM, dan universitas.</p>
      </div>

      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
      >
        {loading ? "Mengunggah..." : "Kirim untuk Verifikasi"}
      </button>
    </form>
  );
};
