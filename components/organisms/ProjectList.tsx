"use client";

import React from "react";
import Link from "next/link";
import { deleteProject, updateProjectStatus } from "@/lib/actions/project";
import { formatRupiah, formatFullDate } from "@/lib/utils";
import { Icon } from "../atoms/Icon";
import { toast } from "sonner";
import { ConfirmationDialog } from "../molecules/ConfirmationDialog";

interface ProjectListProps {
  projects: any[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [statusToggleData, setStatusToggleData] = React.useState<{ id: string; currentStatus: string } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setLoading(true);
    try {
      await deleteProject(deleteId);
      toast.success("Proyek berhasil dihapus.");
      setDeleteId(null);
    } catch (error) {
      toast.error("Gagal menghapus proyek.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusToggleData) return;
    
    setLoading(true);
    const newStatus = statusToggleData.currentStatus === "OPEN" ? "CANCELLED" : "OPEN";
    try {
      await updateProjectStatus(statusToggleData.id, newStatus as any);
      toast.success(`Proyek berhasil ${newStatus === "CANCELLED" ? "dinonaktifkan" : "diaktifkan kembali"}.`);
      setStatusToggleData(null);
    } catch (error) {
      toast.error("Gagal memperbarui status proyek.");
    } finally {
      setLoading(false);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant">
        <Icon name="work_off" className="text-5xl mb-4 opacity-20" />
        <p className="text-on-surface-variant font-medium">Anda belum memiliki proyek.</p>
        <p className="text-xs text-on-surface-variant opacity-60">Mulai dengan memposting proyek baru.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div 
          key={project.id}
          className="bg-surface-container-lowest rounded-xl editorial-shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-outline-variant/10 hover:border-secondary/30 transition-all group"
        >
          <div className="space-y-1 flex-grow">
            <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
               <span className="bg-surface-container-high px-2 py-1 rounded flex items-center gap-1">
                  <Icon name="payments" className="text-[14px]" />
                  {formatRupiah(project.budget)} ({project.budgetType})
               </span>
               <span className="bg-surface-container-high px-2 py-1 rounded flex items-center gap-1">
                  <Icon name="event" className="text-[14px]" />
                  Deadline: {project.deadline ? formatFullDate(project.deadline) : "N/A"}
               </span>
               <span className="bg-primary-container/10 text-primary px-2 py-1 rounded font-bold uppercase tracking-wider">
                  {project.status}
               </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href={`/dashboard/manage-projects/edit/${project.id}`} 
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all" 
              title="Edit"
            >
              <Icon name="edit" />
            </Link>
            <button 
              onClick={() => setStatusToggleData({ id: project.id, currentStatus: project.status })}
              className={`p-2 rounded-lg transition-all ${
                project.status === "OPEN" 
                  ? "text-on-surface-variant hover:bg-surface-container-high" 
                  : "text-secondary hover:bg-secondary/10"
              }`}
              title={project.status === "OPEN" ? "Nonaktifkan" : "Aktifkan Kembali"}
            >
              <Icon name={project.status === "OPEN" ? "visibility_off" : "visibility"} />
            </button>
            <button 
              onClick={() => setDeleteId(project.id)}
              className="p-2 text-error hover:bg-error/10 rounded-lg transition-all" 
              title="Hapus"
            >
              <Icon name="delete" />
            </button>
          </div>
        </div>
      ))}

      <ConfirmationDialog 
        isOpen={!!deleteId}
        title="Hapus Proyek?"
        description="Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
        variant="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={loading}
      />

      <ConfirmationDialog 
        isOpen={!!statusToggleData}
        title={statusToggleData?.currentStatus === "OPEN" ? "Nonaktifkan Proyek?" : "Aktifkan Proyek?"}
        description={
          statusToggleData?.currentStatus === "OPEN" 
            ? "Apakah Anda yakin ingin menonaktifkan proyek ini? Mahasiswa tidak akan dapat melihat atau melamar proyek ini."
            : "Apakah Anda yakin ingin mengaktifkan kembali proyek ini agar dapat dilihat oleh mahasiswa?"
        }
        confirmLabel={statusToggleData?.currentStatus === "OPEN" ? "Ya, Nonaktifkan" : "Ya, Aktifkan"}
        variant={statusToggleData?.currentStatus === "OPEN" ? "error" : "primary"}
        onConfirm={handleToggleStatus}
        onCancel={() => setStatusToggleData(null)}
        isLoading={loading}
      />
    </div>
  );
};
