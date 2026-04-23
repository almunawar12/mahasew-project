"use client";

import React, { useState } from "react";
import { Icon } from "../atoms/Icon";
import { updateBidStatus } from "@/lib/actions/project";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";
import { StudentProfileView } from "./StudentProfileView";
import { ConfirmationDialog } from "../molecules/ConfirmationDialog";

interface ApplicantCardProps {
  bid: any;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({ bid }) => {
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    status: "ACCEPTED" | "REJECTED" | null;
  }>({
    isOpen: false,
    status: null,
  });

  const handleStatusUpdate = async () => {
    const status = dialogConfig.status;
    if (!status) return;
    
    setLoading(true);
    try {
      await updateBidStatus(bid.id, status);
      toast.success(`Lamaran berhasil di-${status.toLowerCase()}`);
      setDialogConfig({ isOpen: false, status: null });
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status lamaran.");
    } finally {
      setLoading(false);
    }
  };

  const isPending = bid.status === "PENDING";

  return (
    <>
      <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6 border border-outline-variant/10 hover:border-primary/20 transition-all group">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container overflow-hidden shrink-0 border border-outline-variant/20">
              {bid.user.image ? (
                <img src={bid.user.image} alt={bid.user.name} className="w-full h-full object-cover" />
              ) : (
                <Icon name="person" className="text-3xl" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-primary group-hover:text-secondary transition-colors">
                  {bid.user.name}
                </h3>
                {bid.user.isVerified && (
                  <Icon name="verified" className="text-sm text-primary" fill />
                )}
              </div>
              <p className="text-xs text-on-surface-variant font-medium">
                {bid.user.profile?.university || "Universitas Belum Diatur"}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {bid.user.profile?.skills.slice(0, 3).map((skill: string) => (
                  <span key={skill} className="px-2 py-0.5 bg-surface-container-high text-[10px] font-bold rounded text-on-surface-variant uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-grow max-w-md">
            <p className="text-[10px] font-black text-on-surface-variant mb-1 uppercase tracking-widest">Pesan Lamaran</p>
            <p className="text-sm text-on-surface line-clamp-3 italic bg-surface-container-low/30 p-3 rounded-lg border border-outline-variant/5">
              "{bid.message}"
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[180px]">
            <div className="text-right mb-1">
               <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Penawaran</p>
               <p className="text-lg font-black text-primary">{formatRupiah(bid.amount)}</p>
            </div>
            
            <button 
              onClick={() => setShowProfile(true)}
              className="w-full py-2 px-4 rounded-lg bg-surface-container-low text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
            >
              <Icon name="visibility" className="text-sm" />
              Lihat Profil Lengkap
            </button>

            {isPending && (
              <div className="flex gap-2">
                <button 
                  disabled={loading}
                  onClick={() => setDialogConfig({ isOpen: true, status: "ACCEPTED" })}
                  className="flex-1 py-3 bg-primary-container text-white rounded-lg font-bold text-xs hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Icon name="check" className="text-sm" />
                  Terima
                </button>
                <button 
                   disabled={loading}
                   onClick={() => setDialogConfig({ isOpen: true, status: "REJECTED" })}
                   className="flex-1 py-3 border border-error text-error rounded-lg font-bold text-xs hover:bg-error/5 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Icon name="close" className="text-sm" />
                  Tolak
                </button>
              </div>
            )}

            {!isPending && (
              <div className={`text-center py-2 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest ${
                bid.status === "ACCEPTED" ? "bg-success/10 text-success" : "bg-error/10 text-error"
              }`}>
                {bid.status === "ACCEPTED" ? "Lamaran Diterima" : "Lamaran Ditolak"}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
              <Icon name="work" className="text-xs" />
              Melamar untuk: <span className="text-primary">{bid.project.title}</span>
           </div>
           <span className="text-[10px] text-on-surface-variant opacity-60">
              {new Date(bid.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
           </span>
        </div>
      </div>

      {showProfile && (
        <StudentProfileView 
          user={bid.user} 
          onClose={() => setShowProfile(false)} 
        />
      )}

      <ConfirmationDialog 
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.status === "ACCEPTED" ? "Terima Lamaran?" : "Tolak Lamaran?"}
        description={`Apakah Anda yakin ingin ${dialogConfig.status === "ACCEPTED" ? "menerima" : "menolak"} lamaran dari ${bid.user.name}?`}
        confirmLabel={dialogConfig.status === "ACCEPTED" ? "Ya, Terima" : "Ya, Tolak"}
        variant={dialogConfig.status === "REJECTED" ? "error" : "primary"}
        onConfirm={handleStatusUpdate}
        onCancel={() => setDialogConfig({ isOpen: false, status: null })}
        isLoading={loading}
      />
    </>
  );
};
