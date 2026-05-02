"use client";

import React, { useState, useTransition } from "react";
import { approveVerification, rejectVerification } from "@/lib/actions/verification";
import { Icon } from "@/components/atoms/Icon";
import { toast } from "sonner";
import { formatFullDate } from "@/lib/utils";

interface Props {
  userId: string;
  userName: string;
  userEmail: string;
  ktmUrl: string;
  joinedAt: Date;
}

export const VerificationReviewCard = ({ userId, userName, userEmail, ktmUrl, joinedAt }: Props) => {
  const [pending, startTransition] = useTransition();
  const [rejectMode, setRejectMode] = useState(false);
  const [note, setNote] = useState("");

  const onApprove = () => {
    startTransition(async () => {
      try {
        await approveVerification(userId);
        toast.success(`${userName} disetujui.`);
      } catch (e: any) {
        toast.error(e?.message || "Gagal");
      }
    });
  };

  const onReject = () => {
    startTransition(async () => {
      try {
        await rejectVerification(userId, note);
        toast.success(`${userName} ditolak.`);
        setRejectMode(false);
        setNote("");
      } catch (e: any) {
        toast.error(e?.message || "Gagal");
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-primary">{userName}</h3>
          <p className="text-sm text-on-surface-variant">{userEmail}</p>
          <p className="text-xs text-outline mt-1">Daftar {formatFullDate(joinedAt)}</p>
        </div>
        <a
          href={ktmUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20"
        >
          <Icon name="open_in_new" className="text-sm" />
          Lihat KTM
        </a>
      </div>

      {rejectMode ? (
        <div className="space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Alasan penolakan (min 5 karakter)..."
            className="w-full p-3 border border-outline-variant rounded-xl text-sm"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={onReject}
              disabled={pending || note.trim().length < 5}
              className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm disabled:opacity-50"
            >
              Konfirmasi Tolak
            </button>
            <button
              onClick={() => setRejectMode(false)}
              className="px-4 py-2 border border-outline-variant rounded-xl font-bold text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            disabled={pending}
            className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-50"
          >
            <Icon name="check" className="text-sm mr-1" />
            Setujui
          </button>
          <button
            onClick={() => setRejectMode(true)}
            disabled={pending}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-xl font-bold text-sm"
          >
            Tolak
          </button>
        </div>
      )}
    </div>
  );
};
