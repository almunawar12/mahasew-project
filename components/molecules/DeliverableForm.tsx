"use client";

import React, { useState } from "react";
import { uploadDeliverable } from "@/lib/actions/payment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const DeliverableForm = ({ bidId }: { bidId: string }) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Pilih file dulu.");
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("note", note);
    try {
      await uploadDeliverable(bidId, fd);
      toast.success("Hasil dikirim ke klien.");
      setFile(null);
      setNote("");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-4">
      <h3 className="font-bold text-primary">Unggah Hasil Kerja</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm border border-outline-variant rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-bold"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Catatan untuk klien (opsional)..."
        className="w-full p-3 border border-outline-variant rounded-xl text-sm"
        rows={3}
      />
      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? "Mengunggah..." : "Kirim Hasil"}
      </button>
    </form>
  );
};
