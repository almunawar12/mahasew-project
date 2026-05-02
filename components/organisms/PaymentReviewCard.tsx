"use client";

import React, { useState, useTransition } from "react";
import { verifyPayment, rejectPayment, releasePayout } from "@/lib/actions/payment";
import { Icon } from "@/components/atoms/Icon";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

interface FreelancerProfile {
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  ewalletProvider: string | null;
  ewalletNumber: string | null;
  phoneNumber: string | null;
}

interface Payment {
  id: string;
  amount: number;
  freelancerCut: number;
  platformCut: number;
  commissionPct: number;
  status: string;
  proofUrl: string | null;
  payoutProofUrl: string | null;
  notes: string | null;
  projectTitle: string;
  clientName: string | null;
  clientEmail: string;
  freelancerName: string;
  freelancerEmail: string;
  contractStatus: string;
  freelancerProfile?: FreelancerProfile | null;
}

export const PaymentReviewCard = ({ payment }: { payment: Payment }) => {
  const [pending, startTransition] = useTransition();
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");
  const [payoutFile, setPayoutFile] = useState<File | null>(null);

  const onVerify = () => {
    startTransition(async () => {
      try {
        await verifyPayment(payment.id);
        toast.success("Pembayaran diverifikasi.");
      } catch (e: any) {
        toast.error(e?.message);
      }
    });
  };

  const onReject = () => {
    startTransition(async () => {
      try {
        await rejectPayment(payment.id, reason);
        toast.success("Bukti ditolak.");
        setRejectMode(false);
      } catch (e: any) {
        toast.error(e?.message);
      }
    });
  };

  const onPayout = async () => {
    if (!payoutFile) return toast.error("Pilih bukti payout.");
    const fd = new FormData();
    fd.append("proof", payoutFile);
    startTransition(async () => {
      try {
        await releasePayout(payment.id, fd);
        toast.success("Payout diteruskan ke freelancer.");
        setPayoutFile(null);
      } catch (e: any) {
        toast.error(e?.message);
      }
    });
  };

  const canPayout = payment.status === "FUNDED" && payment.contractStatus === "COMPLETED";

  return (
    <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-4">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-primary">{payment.projectTitle}</h3>
          <p className="text-sm text-on-surface-variant">
            Client: {payment.clientName} ({payment.clientEmail})
          </p>
          <p className="text-sm text-on-surface-variant">
            Freelancer: {payment.freelancerName} ({payment.freelancerEmail})
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-outline">Total</p>
          <p className="font-black text-lg text-primary">{formatRupiah(payment.amount)}</p>
          <p className="text-xs text-on-surface-variant">
            Freelancer: {formatRupiah(payment.freelancerCut)} | Platform: {formatRupiah(payment.platformCut)} ({payment.commissionPct}%)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">
          {payment.status}
        </span>
        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-bold">
          Kontrak: {payment.contractStatus}
        </span>
      </div>

      {payment.proofUrl && (
        <a href={payment.proofUrl} target="_blank" rel="noreferrer" className="text-primary text-sm font-bold underline inline-flex items-center gap-1">
          <Icon name="receipt" className="text-sm" /> Bukti transfer client
        </a>
      )}
      {payment.payoutProofUrl && (
        <a href={payment.payoutProofUrl} target="_blank" rel="noreferrer" className="text-primary text-sm font-bold underline inline-flex items-center gap-1 ml-4">
          <Icon name="receipt_long" className="text-sm" /> Bukti payout
        </a>
      )}

      {payment.status === "AWAITING_VERIFICATION" && !rejectMode && (
        <div className="flex gap-2 pt-2 border-t border-outline-variant/10">
          <button onClick={onVerify} disabled={pending} className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-50">
            Verifikasi & Tandai FUNDED
          </button>
          <button onClick={() => setRejectMode(true)} disabled={pending} className="px-4 py-2 border border-red-300 text-red-700 rounded-xl font-bold text-sm">
            Tolak Bukti
          </button>
        </div>
      )}

      {rejectMode && (
        <div className="space-y-2 pt-2 border-t border-outline-variant/10">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Alasan penolakan..."
            className="w-full p-3 border border-outline-variant rounded-xl text-sm"
            rows={2}
          />
          <div className="flex gap-2">
            <button onClick={onReject} disabled={pending || reason.length < 5} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm disabled:opacity-50">
              Konfirmasi
            </button>
            <button onClick={() => setRejectMode(false)} className="px-4 py-2 border rounded-xl font-bold text-sm">
              Batal
            </button>
          </div>
        </div>
      )}

      {canPayout && (
        <div className="space-y-3 pt-2 border-t border-outline-variant/10">
          <p className="text-sm font-bold text-on-surface">Project COMPLETED. Teruskan dana ke freelancer.</p>

          {payment.freelancerProfile ? (
            <div className="bg-surface-container-low rounded-xl p-4 text-sm space-y-1">
              <p className="font-bold text-primary mb-1">Tujuan Transfer:</p>
              {payment.freelancerProfile.bankAccountNumber ? (
                <>
                  <p><strong>Bank:</strong> {payment.freelancerProfile.bankName || "-"}</p>
                  <p><strong>No. Rekening:</strong> {payment.freelancerProfile.bankAccountNumber}</p>
                  <p><strong>Atas Nama:</strong> {payment.freelancerProfile.bankAccountName || "-"}</p>
                </>
              ) : payment.freelancerProfile.ewalletNumber ? (
                <>
                  <p><strong>E-Wallet:</strong> {payment.freelancerProfile.ewalletProvider || "-"}</p>
                  <p><strong>No.:</strong> {payment.freelancerProfile.ewalletNumber}</p>
                </>
              ) : (
                <p className="text-red-700 font-bold">Freelancer belum mengisi metode pembayaran.</p>
              )}
              {payment.freelancerProfile.phoneNumber && (
                <p className="text-xs text-outline mt-1">HP: {payment.freelancerProfile.phoneNumber}</p>
              )}
            </div>
          ) : (
            <p className="text-red-700 font-bold text-sm">Freelancer belum mengisi profil pembayaran.</p>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => setPayoutFile(e.target.files?.[0] || null)}
            className="block w-full text-sm border border-outline-variant rounded-xl p-2"
          />
          <button onClick={onPayout} disabled={pending || !payoutFile} className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50">
            Unggah Bukti Payout & Tandai RELEASED
          </button>
        </div>
      )}
    </div>
  );
};
