"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { applyForProject } from "@/lib/actions/project";
import { Icon } from "@/components/atoms/Icon";
import { toast } from "sonner";

interface ApplyButtonProps {
  projectId: string;
  defaultBudget: number;
  hasApplied?: boolean;
  isVerified?: boolean;
}

export const ApplyButton: React.FC<ApplyButtonProps> = ({ projectId, defaultBudget, hasApplied, isVerified }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(defaultBudget);
  const [localHasApplied, setLocalHasApplied] = useState(hasApplied);

  const handleApply = async () => {
    if (!message) {
      toast.error("Silakan tulis pesan lamaran Anda.");
      return;
    }

    setLoading(true);
    try {
      const result = await applyForProject(projectId, { amount, message });
      if (result.success) {
        toast.success("Berhasil melamar proyek!");
        setIsModalOpen(false);
        setLocalHasApplied(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat melamar.");
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <Link href="/dashboard/verification" className="block">
        <Button
          variant="on-primary"
          size="lg"
          className="w-full text-base py-6 rounded-2xl bg-yellow-500 border-none"
        >
          <Icon name="verified_user" className="text-white" />
          Verifikasi KTM Dulu
        </Button>
      </Link>
    );
  }

  if (localHasApplied) {
    return (
      <Button 
        variant="on-primary" 
        size="lg" 
        className="w-full text-xl py-6 rounded-2xl opacity-60 cursor-not-allowed bg-green-600 border-none"
        disabled
      >
        <Icon name="check_circle" className="text-white" />
        Sudah Dilamar
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="on-primary" 
        size="lg" 
        className="w-full text-xl py-6 rounded-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        Lamar Sekarang
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && setIsModalOpen(false)} />
          <div className="relative bg-surface p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-outline-variant/20 animate-in fade-in zoom-in duration-300">
            <header className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-primary">Kirim Lamaran</h3>
                <button onClick={() => !loading && setIsModalOpen(false)} className="text-outline hover:text-primary transition-colors">
                  <Icon name="close" />
                </button>
              </div>
              <p className="text-on-surface-variant">
                Jelaskan mengapa Anda adalah kandidat terbaik untuk proyek ini.
              </p>
            </header>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Penawaran Biaya (Rp)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary transition-all"
                  placeholder="Masukkan nominal penawaran..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2">Pesan Lamaran</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary min-h-[150px] transition-all"
                  placeholder="Contoh: Saya memiliki pengalaman di React..."
                />
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={handleApply}
                disabled={loading}
              >
                {loading ? "Mengirim..." : "Kirim Sekarang"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
