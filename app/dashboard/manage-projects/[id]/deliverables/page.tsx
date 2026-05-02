import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prismadb";
import { ApproveDeliverableButton } from "@/components/molecules/ApproveDeliverableButton";
import { Icon } from "@/components/atoms/Icon";
import { formatFullDate, formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { signOrNull, BUCKET_DELIVERABLE } from "@/lib/supabase";
import { hasReviewedProject } from "@/lib/actions/review";
import { ReviewForm } from "@/components/molecules/ReviewForm";

const contractLabel: Record<string, string> = {
  NONE: "Menunggu Pembayaran",
  ACTIVE: "Sedang Dikerjakan",
  DELIVERED: "Hasil Dikirim",
  COMPLETED: "Selesai",
  DISPUTED: "Sengketa",
};

export default async function ProjectDeliverablesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") redirect("/dashboard");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      bids: {
        where: { status: "ACCEPTED" },
        include: {
          user: { include: { profile: true } },
          deliverables: { orderBy: { createdAt: "desc" } },
          payment: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) notFound();
  if (project.clientId !== session.user.id) redirect("/dashboard");

  const acceptedBids = await Promise.all(
    project.bids.map(async (b) => ({
      ...b,
      signedDeliverables: await Promise.all(
        b.deliverables.map(async (d) => ({ ...d, signedUrl: await signOrNull(BUCKET_DELIVERABLE, d.fileUrl) }))
      ),
    }))
  );

  const allCompleted = acceptedBids.length > 0 && acceptedBids.every((b) => b.contractStatus === "COMPLETED");
  const reviewed = allCompleted ? await hasReviewedProject(project.id) : true;

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      <Link href="/dashboard/manage-projects" className="text-sm text-primary font-bold inline-flex items-center gap-1">
        <Icon name="arrow_back" className="text-sm" /> Kembali
      </Link>

      <header>
        <h1 className="text-2xl font-black text-primary mb-1">Hasil Kerja</h1>
        <p className="text-on-surface-variant text-sm">{project.title}</p>
        <p className="text-xs text-outline mt-1">
          {acceptedBids.length} freelancer aktif dari {project.maxFreelancers} slot
        </p>
      </header>

      {acceptedBids.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-yellow-900">Belum ada freelancer yang diterima.</p>
        </div>
      )}

      {acceptedBids.map((bid, idx) => (
        <div key={bid.id} className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-outline font-bold uppercase tracking-widest">Freelancer #{idx + 1}</p>
              <h3 className="font-bold text-primary text-lg">{bid.user.name}</h3>
              <p className="text-sm text-on-surface-variant">{bid.user.profile?.university || "-"}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-sm">
                <span>Penawaran: <strong>{formatRupiah(bid.amount)}</strong></span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  {contractLabel[bid.contractStatus]}
                </span>
              </div>
            </div>
            <Link href={`/profil/${bid.user.id}`} className="text-primary text-sm font-bold underline shrink-0">
              Profil
            </Link>
          </div>

          {bid.contractStatus === "NONE" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
              Selesaikan pembayaran ke escrow agar freelancer bisa mulai bekerja.{" "}
              <Link href={`/dashboard/manage-projects/${project.id}/payment`} className="text-primary font-bold underline">
                Lihat Pembayaran
              </Link>
            </div>
          )}

          {bid.contractStatus === "ACTIVE" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
              Freelancer sedang mengerjakan. Belum ada hasil yang dikirim.
            </div>
          )}

          {bid.signedDeliverables.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary">Hasil Dikirim</h4>
              {bid.signedDeliverables.map((d) => (
                <div key={d.id} className="p-3 border border-outline-variant/20 rounded-xl space-y-1">
                  <a href={d.signedUrl || "#"} target="_blank" rel="noreferrer" className="text-primary font-bold underline text-sm">
                    Unduh file
                  </a>
                  {d.note && <p className="text-sm text-on-surface-variant">{d.note}</p>}
                  <p className="text-xs text-outline">{formatFullDate(d.createdAt)}</p>
                  {d.approved && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">Disetujui</span>}
                </div>
              ))}
            </div>
          )}

          {bid.contractStatus === "DELIVERED" && (
            <ApproveDeliverableButton bidId={bid.id} />
          )}

          {bid.contractStatus === "COMPLETED" && (
            <p className="text-sm text-green-700 font-bold flex items-center gap-1">
              <Icon name="check_circle" /> Pekerjaan freelancer ini selesai.
            </p>
          )}
        </div>
      ))}

      {allCompleted && !reviewed && (
        <ReviewForm
          projectId={project.id}
          targetName={acceptedBids.map((b) => b.user.name).filter(Boolean).join(", ") || "Freelancer"}
        />
      )}

      {allCompleted && (
        <div className="bg-green-100 border border-green-300 rounded-2xl p-6">
          <p className="text-green-900 font-bold">
            Semua freelancer selesai. Admin akan meneruskan dana ke masing-masing.
          </p>
        </div>
      )}
    </div>
  );
}
