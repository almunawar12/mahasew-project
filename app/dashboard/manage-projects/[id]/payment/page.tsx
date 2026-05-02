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

const statusLabel: Record<string, string> = {
  AWAITING_PROOF: "Menunggu Bukti Transfer",
  AWAITING_VERIFICATION: "Menunggu Verifikasi Admin",
  FUNDED: "Dana Aman di Escrow",
  RELEASED: "Diteruskan ke Freelancer",
  REFUNDED: "Dikembalikan",
  REJECTED: "Bukti Ditolak",
};

export default async function ProjectPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") redirect("/dashboard");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      payments: {
        include: { bid: { include: { user: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) notFound();
  if (project.clientId !== session.user.id) redirect("/dashboard");

  const settings = await getPlatformSettings();
  const totalAmount = project.payments.reduce((s, p) => s + p.amount, 0);
  const totalFreelancerCut = project.payments.reduce((s, p) => s + p.freelancerCut, 0);
  const totalPlatformCut = project.payments.reduce((s, p) => s + p.platformCut, 0);

  const signedPayments = await Promise.all(
    project.payments.map(async (p) => ({
      ...p,
      proofSignedUrl: await signOrNull(BUCKET_PAYMENT, p.proofUrl),
    }))
  );

  return (
    <div className="space-y-6 p-6 max-w-3xl">
      <Link href="/dashboard/manage-projects" className="text-sm text-primary font-bold inline-flex items-center gap-1">
        <Icon name="arrow_back" className="text-sm" /> Kembali
      </Link>

      <header>
        <h1 className="text-2xl font-black text-primary mb-1">Pembayaran Proyek</h1>
        <p className="text-on-surface-variant text-sm">{project.title}</p>
        <p className="text-xs text-outline mt-1">
          {project.payments.length} freelancer diterima dari {project.maxFreelancers} slot
        </p>
      </header>

      {project.payments.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-yellow-900">Belum ada freelancer yang diterima.</p>
          <Link href="/dashboard/applicants" className="text-primary font-bold underline mt-2 inline-block">
            Lihat Pelamar
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-primary-container text-white rounded-2xl p-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70 text-sm">Total Tagihan</span>
              <span className="font-black text-xl">{formatRupiah(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Untuk semua freelancer</span>
              <span>{formatRupiah(totalFreelancerCut)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Komisi Platform ({settings.commissionPct}%)</span>
              <span>{formatRupiah(totalPlatformCut)}</span>
            </div>
          </div>

          <div className="space-y-4">
            {signedPayments.map((p, idx) => (
              <div key={p.id} className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-outline font-bold uppercase tracking-widest">Freelancer #{idx + 1}</p>
                    <h3 className="font-bold text-primary">{p.bid?.user.name}</h3>
                    <p className="text-sm text-on-surface-variant">{p.bid?.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-outline">Tagihan</p>
                    <p className="font-bold text-primary">{formatRupiah(p.amount)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {statusLabel[p.status]}
                  </span>
                </div>

                {(p.status === "AWAITING_PROOF" || p.status === "REJECTED") && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 space-y-2 text-sm text-yellow-900">
                    <p className="font-bold flex items-center gap-1">
                      <Icon name="account_balance" /> Transfer ke:
                    </p>
                    <p>{settings.bankName || "(belum diatur)"} — {settings.bankAccountNumber || "-"} a/n {settings.bankAccountName || "-"}</p>
                    <p>Jumlah: <strong>{formatRupiah(p.amount)}</strong></p>
                    {p.status === "REJECTED" && p.notes && (
                      <p className="bg-red-100 text-red-800 p-2 rounded mt-2 text-xs">
                        Bukti sebelumnya ditolak: {p.notes}
                      </p>
                    )}
                  </div>
                )}

                {(p.status === "AWAITING_PROOF" || p.status === "REJECTED") && (
                  <PaymentProofForm projectId={project.id} paymentId={p.id} />
                )}

                {p.status === "AWAITING_VERIFICATION" && p.proofSignedUrl && (
                  <a href={p.proofSignedUrl} target="_blank" rel="noreferrer" className="text-primary text-sm font-bold underline inline-flex items-center gap-1">
                    <Icon name="receipt" className="text-sm" /> Lihat bukti yang diunggah
                  </a>
                )}

                {p.status === "FUNDED" && (
                  <p className="text-sm text-green-700 font-bold">Dana aman. Freelancer sedang mengerjakan.</p>
                )}
                {p.status === "RELEASED" && (
                  <p className="text-sm text-green-700 font-bold">Pembayaran selesai.</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
