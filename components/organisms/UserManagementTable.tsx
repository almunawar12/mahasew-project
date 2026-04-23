"use client";

import React, { useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { toggleUserVerification } from "@/lib/actions/admin";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/molecules/ConfirmationDialog";

interface UserManagementTableProps {
  users: any[];
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<{ id: string; name: string; isVerified: boolean } | null>(null);

  const handleToggleVerification = async () => {
    if (!confirmData) return;
    
    setLoadingId(confirmData.id);
    try {
      const result = await toggleUserVerification(confirmData.id);
      if (result.success) {
        toast.success(`User ${confirmData.name} berhasil ${result.isVerified ? "diverifikasi" : "dibatalkan verifikasinya"}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
      setConfirmData(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/10">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">User</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Role</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Stats</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden shrink-0 border border-outline-variant/20">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-container">
                           <Icon name="person" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{user.name}</p>
                      <p className="text-[10px] text-on-surface-variant opacity-60">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                    user.role === "OWNER" ? "bg-orange-100 text-orange-700" : 
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : 
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex gap-4 text-[10px] items-center text-on-surface-variant">
                      <div className="flex items-center gap-1" title="Projects Created">
                         <Icon name="work" className="text-xs" />
                         <span className="font-bold">{user._count.projects}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Bids Submitted">
                         <Icon name="description" className="text-xs" />
                         <span className="font-bold">{user._count.bids}</span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   {user.isVerified ? (
                     <div className="flex items-center gap-1 text-success font-bold text-[10px] uppercase tracking-widest">
                        <Icon name="verified" className="text-sm" fill />
                        Verified
                     </div>
                   ) : (
                     <div className="flex items-center gap-1 text-on-surface-variant opacity-40 font-bold text-[10px] uppercase tracking-widest">
                        <Icon name="pending" className="text-sm" />
                        Unverified
                     </div>
                   )}
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                      <button 
                        disabled={loadingId === user.id}
                        onClick={() => setConfirmData({ id: user.id, name: user.name, isVerified: user.isVerified })}
                        className={`p-2 rounded-lg transition-all ${
                          user.isVerified ? "text-error hover:bg-error/10" : "text-success hover:bg-success/10"
                        }`}
                        title={user.isVerified ? "Batalkan Verifikasi" : "Verifikasi User"}
                      >
                         <Icon name={user.isVerified ? "remove_moderator" : "verified_user"} />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all">
                         <Icon name="more_vert" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog 
        isOpen={!!confirmData}
        title={confirmData?.isVerified ? "Batalkan Verifikasi?" : "Verifikasi Pengguna?"}
        description={`Apakah Anda yakin ingin ${confirmData?.isVerified ? "membatalkan verifikasi" : "memverifikasi"} akun ${confirmData?.name}?`}
        confirmLabel={confirmData?.isVerified ? "Ya, Batalkan" : "Ya, Verifikasi"}
        variant={confirmData?.isVerified ? "error" : "primary"}
        onConfirm={handleToggleVerification}
        onCancel={() => setConfirmData(null)}
        isLoading={!!loadingId}
      />
    </>
  );
};
