import React from "react";
import { getPendingVerifications } from "@/lib/actions/verification";
import { VerificationReviewCard } from "@/components/organisms/VerificationReviewCard";
import { Icon } from "@/components/atoms/Icon";
import { signOrNull, BUCKET_KTM } from "@/lib/supabase";

export default async function AdminVerificationsPage() {
  const pending = await getPendingVerifications();
  const signed = await Promise.all(
    pending.map(async (p) => ({ ...p, ktmSignedUrl: await signOrNull(BUCKET_KTM, p.ktmUrl) }))
  );

  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-black text-primary mb-2">Verifikasi Mahasiswa</h1>
        <p className="text-on-surface-variant">Review dokumen KTM yang menunggu persetujuan.</p>
      </header>

      {pending.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-20 text-center border-2 border-dashed border-outline-variant/50">
          <Icon name="task_alt" className="text-5xl text-outline mb-4" />
          <h3 className="text-xl font-bold text-primary">Semua bersih</h3>
          <p className="text-on-surface-variant">Tak ada verifikasi yang menunggu review.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {signed.map((p) => (
            <VerificationReviewCard
              key={p.id}
              userId={p.userId}
              userName={p.user.name || "Tanpa Nama"}
              userEmail={p.user.email}
              ktmUrl={p.ktmSignedUrl || ""}
              joinedAt={p.user.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
