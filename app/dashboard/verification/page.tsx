import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMyVerification } from "@/lib/actions/verification";
import { VerificationForm } from "@/components/molecules/VerificationForm";
import { Icon } from "@/components/atoms/Icon";
import { signOrNull, BUCKET_KTM } from "@/lib/supabase";

export default async function VerificationPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user?.role !== "USER") redirect("/dashboard");

  const data = await getMyVerification();
  const status = data?.verificationStatus || "UNVERIFIED";

  const statusConfig: Record<string, { label: string; color: string; icon: string; desc: string }> = {
    UNVERIFIED: { label: "Belum Verifikasi", color: "bg-gray-100 text-gray-700", icon: "help", desc: "Unggah KTM Anda untuk mulai melamar proyek." },
    PENDING: { label: "Menunggu Review", color: "bg-blue-100 text-blue-700", icon: "schedule", desc: "Admin sedang memeriksa dokumen Anda. Maks 1x24 jam." },
    VERIFIED: { label: "Terverifikasi", color: "bg-green-100 text-green-700", icon: "verified", desc: "Akun Anda sudah terverifikasi. Anda bisa melamar proyek." },
    REJECTED: { label: "Ditolak", color: "bg-red-100 text-red-700", icon: "cancel", desc: "Verifikasi ditolak. Periksa catatan admin lalu unggah ulang." },
  };

  const cfg = statusConfig[status];

  return (
    <div className="space-y-8 p-6 max-w-3xl">
      <header>
        <h1 className="text-3xl font-black text-primary mb-2">Verifikasi Mahasiswa</h1>
        <p className="text-on-surface-variant">
          Verifikasi melindungi platform agar hanya mahasiswa asli yang bisa melamar proyek.
        </p>
      </header>

      <div className={`rounded-2xl p-6 flex items-start gap-4 ${cfg.color}`}>
        <Icon name={cfg.icon} className="text-3xl shrink-0" />
        <div>
          <h3 className="font-bold text-lg">{cfg.label}</h3>
          <p className="text-sm opacity-90 mt-1">{cfg.desc}</p>
          {status === "REJECTED" && data?.verificationNote && (
            <p className="text-sm mt-3 p-3 bg-white/50 rounded-lg">
              <strong>Catatan admin:</strong> {data.verificationNote}
            </p>
          )}
        </div>
      </div>

      {(status === "UNVERIFIED" || status === "REJECTED") && <VerificationForm />}

      {status === "PENDING" && data?.ktmUrl && (
        <KtmPreview path={data.ktmUrl} />
      )}
    </div>
  );
}

async function KtmPreview({ path }: { path: string }) {
  const url = await signOrNull(BUCKET_KTM, path);
  if (!url) return null;
  return (
    <div className="bg-white rounded-2xl p-6 border border-outline-variant/10">
      <p className="text-sm text-on-surface-variant mb-3">Dokumen yang diunggah:</p>
      <a href={url} target="_blank" rel="noreferrer" className="text-primary font-bold underline">
        Lihat dokumen KTM
      </a>
    </div>
  );
}
