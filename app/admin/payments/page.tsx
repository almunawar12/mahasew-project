import React from "react";
import { getPendingPayments } from "@/lib/actions/payment";
import { PaymentReviewCard } from "@/components/organisms/PaymentReviewCard";
import { Icon } from "@/components/atoms/Icon";
import { signOrNull, BUCKET_PAYMENT } from "@/lib/supabase";

export default async function AdminPaymentsPage() {
  const payments = await getPendingPayments();
  const signed = await Promise.all(
    payments.map(async (p) => ({
      ...p,
      proofSignedUrl: await signOrNull(BUCKET_PAYMENT, p.proofUrl),
      payoutSignedUrl: await signOrNull(BUCKET_PAYMENT, p.payoutProofUrl),
    }))
  );

  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-black text-primary mb-2">Pembayaran</h1>
        <p className="text-on-surface-variant">
          Verifikasi bukti transfer client, dan teruskan dana ke freelancer setelah proyek selesai.
        </p>
      </header>

      {payments.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-20 text-center border-2 border-dashed border-outline-variant/50">
          <Icon name="payments" className="text-5xl text-outline mb-4" />
          <h3 className="text-xl font-bold text-primary">Tak ada pembayaran aktif</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {signed.map((p) => (
            <PaymentReviewCard
              key={p.id}
              payment={{
                id: p.id,
                amount: p.amount,
                freelancerCut: p.freelancerCut,
                platformCut: p.platformCut,
                commissionPct: p.commissionPct,
                status: p.status,
                proofUrl: p.proofSignedUrl,
                payoutProofUrl: p.payoutSignedUrl,
                notes: p.notes,
                projectTitle: p.project.title,
                clientName: p.project.client.name,
                clientEmail: p.project.client.email,
                freelancerName: p.bid?.user.name || "",
                freelancerEmail: p.bid?.user.email || "",
                contractStatus: p.bid?.contractStatus || "NONE",
                freelancerProfile: p.bid?.user.profile || null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
