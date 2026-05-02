import React from "react";
import { auth } from "@/auth";
import { getAdminStats, getRecentActivity } from "@/lib/actions/admin";
import { Icon } from "@/components/atoms/Icon";
import { formatRupiah } from "@/lib/utils";

function timeAgo(date: Date) {
  const ms = Date.now() - new Date(date).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

export default async function AdminPage() {
  const session = await auth();
  const [stats, activity] = await Promise.all([getAdminStats(), getRecentActivity()]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-primary-container to-primary-fixed-dim rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-4xl font-headline font-black mb-3 tracking-tighter">Control Center</h2>
          <p className="text-white/80 text-lg max-w-xl font-medium">
            Selamat datang kembali, <span className="text-secondary-container font-black">{session?.user?.name}</span>.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <Icon name="admin_panel_settings" className="absolute bottom-[-20px] right-[-20px] text-[200px] text-white/10 rotate-12" />
      </div>

      {(stats.pendingVerifications > 0 || stats.pendingPayments > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {stats.pendingVerifications > 0 && (
            <a href="/admin/verifications" className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 flex items-center justify-between hover:bg-yellow-100 transition-all">
              <div>
                <p className="text-xs font-black uppercase text-yellow-700 tracking-widest">Perlu Tindakan</p>
                <p className="text-2xl font-black text-yellow-900 mt-1">{stats.pendingVerifications} Verifikasi KTM</p>
                <p className="text-xs text-yellow-700 mt-1">Menunggu review</p>
              </div>
              <Icon name="verified_user" className="text-4xl text-yellow-700" />
            </a>
          )}
          {stats.pendingPayments > 0 && (
            <a href="/admin/payments" className="bg-orange-50 border border-orange-300 rounded-2xl p-6 flex items-center justify-between hover:bg-orange-100 transition-all">
              <div>
                <p className="text-xs font-black uppercase text-orange-700 tracking-widest">Perlu Tindakan</p>
                <p className="text-2xl font-black text-orange-900 mt-1">{stats.pendingPayments} Pembayaran</p>
                <p className="text-xs text-orange-700 mt-1">Menunggu verifikasi</p>
              </div>
              <Icon name="payments" className="text-4xl text-orange-700" />
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pengguna" value={stats.totalUsers.toString()} subValue={`${stats.verifiedUsers} Terverifikasi`} icon="group" color="blue" />
        <StatCard title="Proyek Aktif" value={stats.pendingProjects.toString()} subValue={`Dari total ${stats.totalProjects}`} icon="work" color="orange" />
        <StatCard title="Total Lamaran" value={stats.totalBids.toString()} subValue="Bids terkirim" icon="description" color="purple" />
        <StatCard title="Pendapatan Komisi" value={formatRupiah(stats.totalCommissionEarned)} subValue={`${stats.completedProjects} proyek selesai`} icon="paid" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl editorial-shadow p-8 border border-outline-variant/10">
          <h3 className="font-headline font-bold text-xl text-primary mb-6 flex items-center gap-2">
            <Icon name="history" />
            Aktivitas Platform
          </h3>
          <div className="space-y-6">
            {activity.length === 0 ? (
              <p className="text-sm text-on-surface-variant">Belum ada aktivitas.</p>
            ) : (
              activity.map((a, i) => (
                <ActivityItem key={i} title={a.title} description={a.description} time={timeAgo(a.time)} type={a.type} />
              ))
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl editorial-shadow p-8 border border-outline-variant/10">
          <h3 className="font-headline font-bold text-xl text-primary mb-6">Akses Cepat</h3>
          <div className="grid grid-cols-1 gap-3">
            <QuickActionLink href="/admin/users" label="Kelola Pengguna" icon="person_search" />
            <QuickActionLink href="/admin/verifications" label="Verifikasi KTM" icon="verified_user" badge={stats.pendingVerifications} />
            <QuickActionLink href="/admin/payments" label="Pembayaran" icon="payments" badge={stats.pendingPayments} />
            <QuickActionLink href="/admin/moderation" label="Moderasi Proyek" icon="shield" />
            <QuickActionLink href="/admin/settings" label="Pengaturan" icon="settings" />
          </div>
        </div>
      </div>
    </div>
  );
}

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-600" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-600" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-600" },
  green: { bg: "bg-green-500/10", text: "text-green-600" },
};

function StatCard({ title, value, subValue, icon, color }: any) {
  const c = colorMap[color];
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl editorial-shadow border border-outline-variant/10 hover:border-primary/20 transition-all group">
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
        <Icon name={icon} className={c.text} />
      </div>
      <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-headline font-black text-primary mb-1 break-words">{value}</p>
      <p className="text-[10px] text-on-surface-variant opacity-60 font-bold">{subValue}</p>
    </div>
  );
}

function ActivityItem({ title, description, time, type }: any) {
  const dotColor: Record<string, string> = {
    user: "bg-blue-500",
    project: "bg-orange-500",
    bid: "bg-purple-500",
    completed: "bg-green-500",
    payment: "bg-yellow-500",
  };
  return (
    <div className="flex gap-4 group">
      <div className={`w-2 h-2 rounded-full ${dotColor[type] || "bg-secondary-container"} mt-2 shrink-0`} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-on-surface">{title}</h4>
        <p className="text-xs text-on-surface-variant truncate">{description}</p>
        <p className="text-[9px] text-on-surface-variant opacity-50 mt-1 uppercase font-black">{time}</p>
      </div>
    </div>
  );
}

function QuickActionLink({ href, label, icon, badge }: any) {
  return (
    <a href={href} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-primary-container hover:text-white transition-all group">
      <div className="flex items-center gap-3">
        <Icon name={icon} />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>
        )}
        <Icon name="chevron_right" className="text-sm opacity-40 group-hover:opacity-100" />
      </div>
    </a>
  );
}
