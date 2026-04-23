"use client";

import React, { useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { deleteProjectAdmin } from "@/lib/actions/admin";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/molecules/ConfirmationDialog";
import { updateProjectStatus } from "@/lib/actions/project";

interface ProjectModerationListProps {
  projects: any[];
}

export const ProjectModerationList: React.FC<ProjectModerationListProps> = ({ projects }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    
    setLoadingId(confirmDeleteId);
    try {
      const result = await deleteProjectAdmin(confirmDeleteId);
      if (result.success) {
        toast.success("Proyek berhasil dihapus secara permanen.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    setLoadingId(id);
    const newStatus = currentStatus === "OPEN" ? "CANCELLED" : "OPEN";
    try {
      const result = await updateProjectStatus(id, newStatus as any);
      if (result.success) {
        toast.success(`Status proyek berhasil diubah ke ${newStatus}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-surface-container-lowest rounded-xl editorial-shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-outline-variant/10 hover:border-error/20 transition-all group">
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                  project.status === "OPEN" ? "bg-success/10 text-success" : "bg-error/10 text-error"
                }`}>
                  {project.status}
                </span>
                <h3 className="text-lg font-bold text-primary group-hover:text-error transition-colors">{project.title}</h3>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant font-medium">
                 <span className="flex items-center gap-1.5">
                    <Icon name="person" className="text-sm" />
                    {project.client.name} ({project.client.email})
                 </span>
                 <span className="flex items-center gap-1.5">
                    <Icon name="payments" className="text-sm" />
                    {formatRupiah(project.budget)}
                 </span>
                 <span className="flex items-center gap-1.5">
                    <Icon name="history" className="text-sm" />
                    {new Date(project.createdAt).toLocaleDateString("id-ID")}
                 </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
               <button 
                 disabled={loadingId === project.id}
                 onClick={() => handleStatusToggle(project.id, project.status)}
                 className={`p-2 rounded-lg transition-all ${
                   project.status === "OPEN" ? "text-on-surface-variant hover:bg-surface-container-high" : "text-success hover:bg-success/10"
                 }`}
                 title={project.status === "OPEN" ? "Sembunyikan/Suspend" : "Aktifkan"}
               >
                  <Icon name={project.status === "OPEN" ? "block" : "check_circle"} />
               </button>
               <button 
                 disabled={loadingId === project.id}
                 onClick={() => setConfirmDeleteId(project.id)}
                 className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                 title="Hapus Permanen"
               >
                  <Icon name="delete_forever" />
               </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationDialog 
        isOpen={!!confirmDeleteId}
        title="Hapus Proyek Secara Permanen?"
        description="Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan dan proyek akan dihapus dari sistem sepenuhnya."
        confirmLabel="Ya, Hapus Permanen"
        variant="error"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
        isLoading={!!loadingId}
      />
    </>
  );
};
