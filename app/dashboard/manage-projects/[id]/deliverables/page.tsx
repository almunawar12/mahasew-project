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

export default async function ProjectDeliverablesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") redirect("/dashboard");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      payment: true,
      bids: {
        where: { status: "ACCEPTED" },
        include: {
          user: { include: { profile: true } },
          deliverables: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!project) notFound();
  if (project.clientId !== session.user.id) redirect("/dashboard");

  const acceptedBid = project.bids[0];
  const signedDeliverables = acceptedBid
    ? await Promise.all(
        acceptedBid.deliverables.map(async (d) => ({ ...d, signedUrl: await signOrNull(BUCKET_DELIVERABLE, d.fileUrl) }))
      )
    : [];

  return (
    <div className="space-y-6 p-6 max-w-3xl">
      <Link href="/dashboard/manage-projects" className="text-sm text-primary font-bold inline-flex items-center gap-1">
        <Icon name="arrow_back" className="text-sm" /> Kembali
      </Link>

      <header>
        <h1 className="text-2xl font-black text-primary mb-1">Hasil Kerja</h1>
        <p className="text-on-surface-variant text-sm">{project.title}</p>
      </header>

      {!acceptedBid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-yellow-900">Belum ada freelancer yang diterima.</p>
        </div>
      )}

      {acceptedBid && (
        <>
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/10">
            <p className="text-sm text-on-surface-variant">Freelancer</p>
            <p className="font-bold text-primary">{acceptedBid.user.name}</p>
            <p className="text-sm text-on-surface-variant">{acceptedBid.user.profile?.university || "-"}</p>
            <div className="flex gap-4 mt-3 text-sm">
              <span>Penawaran: <strong>{formatRupiah(acceptedBid.amount)}</strong></span>
              <span>Status Kontrak: <strong>{acceptedBid.contractStatus}</strong></span>
            </div>
          </div>

          {acceptedBid.contractStatus === "ACTIVE" && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <p className="text-blue-900">Freelancer sedang mengerjakan. Belum ada hasil yang dikirim.</p>
            </div>
          )}

          {signedDeliverables.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-3">
              <h3 className="font-bold text-primary">Hasil Dikirim</h3>
              {signedDeliverables.map((d) => (
                <div key={d.id} className="p-4 border border-outline-variant/20 rounded-xl space-y-2">
                  <a href={d.signedUrl || "#"} target="_blank" rel="noreferrer" className="text-primary font-bold underline">
                    Unduh file
                  </a>
                  {d.note && <p className="text-sm text-on-surface-variant">{d.note}</p>}
                  <p className="text-xs text-outline">{formatFullDate(d.createdAt)}</p>
                  {d.approved && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">Disetujui</span>}
                </div>
              ))}
            </div>
          )}

          {acceptedBid.contractStatus === "DELIVERED" && (
            <ApproveDeliverableButton bidId={acceptedBid.id} />
          )}

          {acceptedBid.contractStatus === "COMPLETED" && (
            <>
              <div className="bg-green-100 border border-green-300 rounded-2xl p-6">
                <p className="text-green-900 font-bold">Proyek selesai. Admin akan meneruskan dana ke freelancer.</p>
              </div>
              {!(await hasReviewedProject(acceptedBid.projectId)) && (
                <ReviewForm projectId={acceptedBid.projectId} targetName={acceptedBid.user.name || "Freelancer"} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
