import React from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import prisma from "@/lib/prismadb";
import { getReviewsForUser, getUserRatingSummary } from "@/lib/actions/review";
import { notFound } from "next/navigation";
import { Icon } from "@/components/atoms/Icon";
import { StarRating } from "@/components/molecules/StarRating";
import { formatFullDate } from "@/lib/utils";
import { Badge } from "@/components/atoms/Badge";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
  if (!user) notFound();

  const [reviews, summary] = await Promise.all([
    getReviewsForUser(id),
    getUserRatingSummary(id),
  ]);

  const isVerifiedStudent = user.profile?.verificationStatus === "VERIFIED";

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-[900px] mx-auto px-6 space-y-8">
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-6">
              <img
                src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                alt={user.name || ""}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl font-black text-primary">{user.name}</h1>
                  {isVerifiedStudent && (
                    <Badge variant="premium">
                      <Icon name="verified" className="text-sm mr-1" />
                      Mahasiswa Terverifikasi
                    </Badge>
                  )}
                </div>
                {user.profile?.university && (
                  <p className="text-on-surface-variant">{user.profile.university}</p>
                )}
                {summary.totalReviews > 0 ? (
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating value={Math.round(summary.avgRating || 0)} readOnly size="sm" />
                    <span className="font-bold text-primary">{summary.avgRating}</span>
                    <span className="text-sm text-on-surface-variant">
                      ({summary.totalReviews} review)
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant mt-2">Belum ada review</p>
                )}
              </div>
            </div>

            {user.profile?.bio && (
              <p className="mt-6 text-on-surface-variant leading-relaxed">{user.profile.bio}</p>
            )}

            {user.profile?.skills && user.profile.skills.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {user.profile.skills.map((s) => (
                  <Badge key={s} variant="skill">{s}</Badge>
                ))}
              </div>
            )}
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Review</h2>
            {reviews.length === 0 ? (
              <div className="bg-surface-container-low rounded-2xl p-12 text-center border-2 border-dashed border-outline-variant/50">
                <Icon name="reviews" className="text-4xl text-outline mb-2" />
                <p className="text-on-surface-variant">Belum ada review.</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.fromUser.image || `https://ui-avatars.com/api/?name=${r.fromUser.name}`}
                        alt={r.fromUser.name || ""}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-primary text-sm">{r.fromUser.name}</p>
                        <p className="text-xs text-outline">{formatFullDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <StarRating value={r.rating} readOnly size="sm" />
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Proyek: <span className="font-bold">{r.project.title}</span>
                  </p>
                  {r.comment && <p className="text-on-surface italic">"{r.comment}"</p>}
                </div>
              ))
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
