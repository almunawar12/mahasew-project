import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prismadb";
import { DeliverableForm } from "@/components/molecules/DeliverableForm";
import { Icon } from "@/components/atoms/Icon";
import { formatRupiah, formatFullDate } from "@/lib/utils";
import Link from "next/link";
import { signOrNull, BUCKET_DELIVERABLE, BUCKET_PAYMENT } from "@/lib/supabase";
import { hasReviewedProject } from "@/lib/actions/review";
import { ReviewForm } from "@/components/molecules/ReviewForm";

export default async function BidDetailPage({ params }: { params: Promise<{ bidId: string }> }) {
  const { bidId } = await params;
  const session = await auth();
  if (!session || session.user?.role !== "USER") redirect("/dashboard");

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: { include: { client: true } },
      payment: true,
      deliverables: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!bid) notFound();
  if (bid.userId !== session.user.id) redirect("/dashboard/my-applications");

  const deliverables = await Promise.all(
    bid.deliverables.map(async (d) => ({ ...d, signedUrl: await signOrNull(BUCKET_DELIVERABLE, d.fileUrl) }))
  );

  const payoutSignedUrl = await signOrNull(BUCKET_PAYMENT, bid.payment?.payoutProofUrl);

  const contractLabels: Record<string, string> = {
    NONE: "Belum ada kontrak",
    ACTIVE: "Kontrak Aktif - Siap Dikerjakan",
    DELIVERED: "Hasil Telah Dikirim",
    COMPLETED: "Selesai",
    DISPUTED: "Sengketa",
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl">
      <Link href="/dashboard/my-applications" className="text-sm text-primary font-bold inline-flex items-center gap-1">
        <Icon name="arrow_back" className="text-sm" /> Kembali
      </Link>

      <header>
        <h1 className="text-2xl font-black text-primary mb-1">{bid.project.title}</h1>
        <p className="text-on-surface-variant text-sm">Klien: {bid.project.client.name}</p>
      </header>

      <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Penawaran Anda</span>
          <span className="font-bold">{formatRupiah(bid.amount)}</span>
        </div>
        {bid.payment && (
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Bersih untuk Anda (setelah komisi {bid.payment.commissionPct}%)</span>
            <span className="font-bold text-green-700">{formatRupiah(bid.payment.freelancerCut)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Status Lamaran</span>
          <span className="font-bold">{bid.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Status Kontrak</span>
          <span className="font-bold">{contractLabels[bid.contractStatus]}</span>
        </div>
        {bid.payment && (
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Status Pembayaran</span>
            <span className="font-bold">{bid.payment.status}</span>
          </div>
        )}
      </div>

      {bid.contractStatus === "NONE" && bid.status === "PENDING" && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-blue-900">Lamaran masih PENDING. Tunggu keputusan klien.</p>
        </div>
      )}

      {bid.contractStatus === "NONE" && bid.status === "ACCEPTED" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-yellow-900">
            Lamaran diterima. Menunggu klien membayar ke escrow platform. Anda boleh mulai bekerja setelah kontrak AKTIF.
          </p>
        </div>
      )}

      {(bid.contractStatus === "ACTIVE" || bid.contractStatus === "DELIVERED") && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <p className="text-green-900 font-bold mb-2">
              <Icon name="lock" className="inline mr-2" />
              Dana sudah aman di escrow platform.
            </p>
            <p className="text-sm text-green-800">
              Kerjakan proyek sesuai kesepakatan. Unggah hasil akhir di bawah. Setelah klien menyetujui, dana akan diteruskan ke Anda.
            </p>
          </div>
          <DeliverableForm bidId={bid.id} />
        </>
      )}

      {deliverables.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-3">
          <h3 className="font-bold text-primary">Hasil yang Dikirim</h3>
          {deliverables.map((d) => (
            <div key={d.id} className="flex items-start justify-between gap-4 p-3 border border-outline-variant/20 rounded-xl">
              <div className="flex-1 min-w-0">
                <a href={d.signedUrl || "#"} target="_blank" rel="noreferrer" className="text-primary font-bold text-sm underline">
                  Unduh file
                </a>
                {d.note && <p className="text-sm text-on-surface-variant mt-1">{d.note}</p>}
                <p className="text-xs text-outline mt-1">{formatFullDate(d.createdAt)}</p>
              </div>
              {d.approved && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">Disetujui</span>}
            </div>
          ))}
        </div>
      )}

      {bid.contractStatus === "COMPLETED" && (
        <>
          {bid.payment?.status === "RELEASED" ? (
            <div className="bg-green-100 border border-green-300 rounded-2xl p-6 space-y-2">
              <p className="text-green-900 font-bold flex items-center gap-2">
                <Icon name="paid" /> Pembayaran telah diterima.
              </p>
              <p className="text-sm text-green-800">
                Admin sudah meneruskan {formatRupiah(bid.payment.freelancerCut)} ke rekening Anda.
              </p>
              {payoutSignedUrl && (
                <a href={payoutSignedUrl} target="_blank" rel="noreferrer" className="text-primary font-bold text-sm underline">
                  Lihat bukti payout
                </a>
              )}
            </div>
          ) : (
            <div className="bg-green-100 border border-green-300 rounded-2xl p-6">
              <p className="text-green-900 font-bold">Proyek selesai. Pembayaran akan diteruskan oleh admin.</p>
            </div>
          )}
          {!(await hasReviewedProject(bid.projectId)) && (
            <ReviewForm projectId={bid.projectId} targetName={bid.project.client.name || "Klien"} />
          )}
        </>
      )}
    </div>
  );
}
