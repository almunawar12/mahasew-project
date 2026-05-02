"use client";

import React, { useState } from "react";
import { updatePlatformSettings } from "@/lib/actions/settings";
import { toast } from "sonner";

interface Initial {
  commissionPct: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export const SettingsForm = ({ initial }: { initial: Initial }) => {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePlatformSettings({
        commissionPct: Number(data.commissionPct),
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountName: data.bankAccountName,
      });
      toast.success("Pengaturan disimpan.");
    } catch (e: any) {
      toast.error(e?.message || "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-5">
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">
          Komisi Platform (%)
        </label>
        <input
          type="number"
          step="0.1"
          min={0}
          max={100}
          value={data.commissionPct}
          onChange={(e) => setData({ ...data, commissionPct: Number(e.target.value) })}
          className="w-full p-3 border border-outline-variant rounded-xl"
          required
        />
        <p className="text-xs text-on-surface-variant mt-1">
          Persentase yang dipotong dari pembayaran client sebelum diteruskan ke freelancer.
        </p>
      </div>

      <div className="border-t border-outline-variant/20 pt-5 space-y-4">
        <h3 className="font-bold text-primary">Rekening Penampung (Escrow)</h3>
        <div>
          <label className="block text-sm font-bold mb-2">Nama Bank</label>
          <input
            type="text"
            value={data.bankName}
            onChange={(e) => setData({ ...data, bankName: e.target.value })}
            placeholder="Contoh: BCA"
            className="w-full p-3 border border-outline-variant rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">No. Rekening</label>
          <input
            type="text"
            value={data.bankAccountNumber}
            onChange={(e) => setData({ ...data, bankAccountNumber: e.target.value })}
            className="w-full p-3 border border-outline-variant rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Atas Nama</label>
          <input
            type="text"
            value={data.bankAccountName}
            onChange={(e) => setData({ ...data, bankAccountName: e.target.value })}
            className="w-full p-3 border border-outline-variant rounded-xl"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan Pengaturan"}
      </button>
    </form>
  );
};
