import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prismadb";
import { getPlatformSettings } from "@/lib/actions/settings";
import { PaymentProofForm } from "@/components/molecules/PaymentProofForm";
import { Icon } from "@/components/atoms/Icon";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { signOrNull, BUCKET_PAYMENT } from "@/lib/supabase";

export default async function ProjectPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") redirect("/dashboard");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      payment: { include: { bid: { include: { user: true } } } },
    },
  });

  if (!project) notFound();
  if (project.clientId !== session.user.id) redirect("/dashboard");
  if (!project.payment) {
    return (
      <div className="p-6 max-w-3xl">
        <h1 className="text-2xl font-black text-primary mb-2">Pembayaran</h1>
        <p className="text-on-surface-variant">Belum ada bid yang diterima utk proyek ini.</p>
        <Link href="/dashboard/applicants" className="text-primary font-bold underline mt-4 inline-block">
          Lihat Pelamar
        </Link>
      </div>
    );
  }

  const settings = await getPlatformSettings();
  const p = project.payment;
  const proofSignedUrl = await signOrNull(BUCKET_PAYMENT, p.proofUrl);
  const statusLabel: Record<string, string> = {
    AWAITING_PROOF: "Menunggu Bukti Transfer",
    AWAITING_VERIFICATION: "Menunggu Verifikasi Admin",
    FUNDED: "Dana Telah Diamankan",
    RELEASED: "Dana Telah Diteruskan ke Freelancer",
    REFUNDED: "Dikembalikan",
    REJECTED: "Bukti Ditolak",
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl">
      <header>
        <h1 className="text-2xl font-black text-primary mb-1">Pembayaran Proyek</h1>
        <p className="text-on-surface-variant text-sm">{project.title}</p>
      </header>

      <div className="bg-primary-container text-white rounded-2xl p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-white/70 text-sm">Total Tagihan</span>
          <span className="font-black text-xl">{formatRupiah(p.amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Untuk Freelancer</span>
          <span>{formatRupiah(p.freelancerCut)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Komisi Platform ({p.commissionPct}%)</span>
          <span>{formatRupiah(p.platformCut)}</span>
        </div>
        <div className="border-t border-white/20 pt-3 flex justify-between text-sm">
          <span className="text-white/70">Status</span>
          <span className="font-bold">{statusLabel[p.status]}</span>
        </div>
      </div>

      {(p.status === "AWAITING_PROOF" || p.status === "REJECTED") && (
        <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 space-y-3">
          <h3 className="font-bold text-yellow-900 flex items-center gap-2">
            <Icon name="account_balance" /> Transfer ke Rekening Platform
          </h3>
          <div className="text-sm text-yellow-900 space-y-1">
            <p><strong>Bank:</strong> {settings.bankName || "(belum diatur admin)"}</p>
            <p><strong>No. Rekening:</strong> {settings.bankAccountNumber || "-"}</p>
            <p><strong>Atas Nama:</strong> {settings.bankAccountName || "-"}</p>
            <p><strong>Jumlah:</strong> {formatRupiah(p.amount)}</p>
          </div>
          <p className="text-xs text-yellow-800">
            Setelah transfer, unggah bukti di bawah. Admin akan verifikasi dalam 1x24 jam.
          </p>
          {p.status === "REJECTED" && p.notes && (
            <p className="text-sm bg-red-100 text-red-800 p-3 rounded-lg">
              <strong>Bukti sebelumnya ditolak:</strong> {p.notes}
            </p>
          )}
        </div>
      )}

      {(p.status === "AWAITING_PROOF" || p.status === "REJECTED") && (
        <PaymentProofForm projectId={project.id} />
      )}

      {p.status === "AWAITING_VERIFICATION" && proofSignedUrl && (
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 space-y-3">
          <p className="text-blue-900">Bukti telah dikirim. Menunggu verifikasi admin.</p>
          <a href={proofSignedUrl} target="_blank" rel="noreferrer" className="text-primary font-bold underline">
            Lihat bukti yang diunggah
          </a>
        </div>
      )}

      {p.status === "FUNDED" && (
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <p className="text-green-900 font-bold">Dana aman. Freelancer sedang mengerjakan proyek.</p>
        </div>
      )}

      {p.status === "RELEASED" && (
        <div className="bg-green-100 rounded-2xl p-6 border border-green-300">
          <p className="text-green-900 font-bold">Pembayaran selesai. Dana telah diteruskan ke freelancer.</p>
        </div>
      )}
    </div>
  );
}
