import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/organisms/ProfileForm";
import { Icon } from "@/components/atoms/Icon";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const profile = await getMyProfile();
  const role = session.user?.role;

  const completion = computeCompletion(profile, role);

  return (
    <div className="space-y-8 p-6 max-w-4xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2">Profil Saya</h1>
          <p className="text-on-surface-variant">
            Lengkapi profil agar peluang diterima proyek lebih besar.
          </p>
        </div>
        <Link
          href={`/profil/${session.user.id}`}
          className="px-4 py-2 border border-primary text-primary font-bold rounded-xl text-sm hover:bg-primary/5"
        >
          Lihat Profil Publik
        </Link>
      </header>

      <div className="bg-white rounded-2xl p-5 border border-outline-variant/10">
        <div className="flex justify-between text-sm font-bold mb-2">
          <span className="text-primary">Kelengkapan Profil</span>
          <span>{completion}%</span>
        </div>
        <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${completion >= 80 ? "bg-green-500" : completion >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {role === "USER" && profile?.verificationStatus !== "VERIFIED" && (
        <Link
          href="/dashboard/verification"
          className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 flex items-center justify-between hover:bg-yellow-100 transition-all"
        >
          <div className="flex items-center gap-4">
            <Icon name="verified_user" className="text-3xl text-yellow-700" />
            <div>
              <p className="font-bold text-yellow-900">Belum verifikasi KTM</p>
              <p className="text-sm text-yellow-800">Verifikasi dulu sebelum melamar proyek.</p>
            </div>
          </div>
          <Icon name="chevron_right" className="text-yellow-700" />
        </Link>
      )}

      <ProfileForm
        initial={{
          fullName: profile?.fullName || session.user.name || "",
          bio: profile?.bio || "",
          university: profile?.university || "",
          phoneNumber: profile?.phoneNumber || "",
          skills: profile?.skills || [],
          portfolioUrl: profile?.portfolioUrl || "",
          avatarUrl: profile?.avatarUrl || session.user.image || "",
          bankName: profile?.bankName || "",
          bankAccountNumber: profile?.bankAccountNumber || "",
          bankAccountName: profile?.bankAccountName || "",
          ewalletProvider: profile?.ewalletProvider || "",
          ewalletNumber: profile?.ewalletNumber || "",
        }}
        showStudentFields={role === "USER"}
      />
    </div>
  );
}

function computeCompletion(profile: any, role: string | undefined) {
  const fields = [
    profile?.fullName,
    profile?.bio,
    profile?.phoneNumber,
    profile?.avatarUrl,
  ];
  if (role === "USER") {
    fields.push(profile?.university);
    fields.push(profile?.skills?.length > 0 ? "x" : null);
    fields.push(profile?.portfolioUrl);
    fields.push(profile?.bankAccountNumber || profile?.ewalletNumber);
  }
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
