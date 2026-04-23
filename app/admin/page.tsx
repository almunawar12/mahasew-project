import React from "react";
import { auth } from "@/auth";
import { getAdminStats } from "@/lib/actions/admin";
import { Icon } from "@/components/atoms/Icon";

export default async function AdminPage() {
  const session = await auth();
  const stats = await getAdminStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-primary-container to-primary-fixed-dim rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-4xl font-headline font-black mb-3 tracking-tighter">
            Control Center
          </h2>
          <p className="text-white/80 text-lg max-w-xl font-medium">
            Selamat datang kembali, <span className="text-secondary-container font-black">{session?.user?.name}</span>. 
            Semua sistem berjalan normal. Pantau performa platform MahaSewa di sini.
          </p>
        </div>
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors" />
        <Icon name="admin_panel_settings" className="absolute bottom-[-20px] right-[-20px] text-[200px] text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pengguna" 
          value={stats.totalUsers.toString()} 
          subValue={`${stats.verifiedUsers} Terverifikasi`}
          icon="group"
          color="bg-blue-500"
        />
        <StatCard 
          title="Proyek Aktif" 
          value={stats.pendingProjects.toString()} 
          subValue={`Dari total ${stats.totalProjects}`}
          icon="work"
          color="bg-orange-500"
        />
        <StatCard 
          title="Total Lamaran" 
          value={stats.totalBids.toString()} 
          subValue="Bids terkirim"
          icon="description"
          color="bg-purple-500"
        />
        <StatCard 
          title="Kesehatan Sistem" 
          value="Stabil" 
          subValue="Server: Online"
          icon="dns"
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl editorial-shadow p-8 border border-outline-variant/10">
          <h3 className="font-headline font-bold text-xl text-primary mb-6 flex items-center gap-2">
            <Icon name="history" />
            Aktivitas Platform
          </h3>
          <div className="space-y-6">
             <ActivityItem title="Pendaftaran Baru" description="5 mahasiswa baru bergabung hari ini" time="2 jam lalu" />
             <ActivityItem title="Proyek Selesai" description="Proyek 'Web Design' telah ditandai selesai" time="5 jam lalu" />
             <ActivityItem title="Laporan Baru" description="Tidak ada laporan pelanggaran" time="Hari ini" />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl editorial-shadow p-8 border border-outline-variant/10">
           <h3 className="font-headline font-bold text-xl text-primary mb-6">Akses Cepat</h3>
           <div className="grid grid-cols-1 gap-3">
              <QuickActionLink href="/admin/users" label="Kelola Pengguna" icon="person_search" />
              <QuickActionLink href="/admin/moderation" label="Moderasi Proyek" icon="verified_user" />
              <QuickActionLink href="/admin/stats" label="Data Statistik" icon="bar_chart" />
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon, color }: any) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl editorial-shadow border border-outline-variant/10 hover:border-primary/20 transition-all group overflow-hidden relative">
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl ${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
           <Icon name={icon} className={`${color.replace('bg-', 'text-')}`} />
        </div>
        <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-headline font-black text-primary mb-1">{value}</p>
        <p className="text-[10px] text-on-surface-variant opacity-60 font-bold">{subValue}</p>
      </div>
      <div className={`absolute top-0 right-0 w-24 h-24 ${color}/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:${color}/10 transition-colors`} />
    </div>
  );
}

function ActivityItem({ title, description, time }: any) {
  return (
    <div className="flex gap-4 group">
      <div className="w-1.5 h-1.5 rounded-full bg-secondary-container mt-2 shadow-[0_0_8px_rgba(253,139,0,0.5)] group-hover:scale-150 transition-transform" />
      <div>
        <h4 className="text-sm font-bold text-on-surface">{title}</h4>
        <p className="text-xs text-on-surface-variant">{description}</p>
        <p className="text-[9px] text-on-surface-variant opacity-50 mt-1 uppercase font-black">{time}</p>
      </div>
    </div>
  );
}

function QuickActionLink({ href, label, icon }: any) {
  return (
    <a href={href} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-primary-container hover:text-white transition-all group">
       <div className="flex items-center gap-3">
          <Icon name={icon} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold">{label}</span>
       </div>
       <Icon name="chevron_right" className="text-sm opacity-40 group-hover:opacity-100" />
    </a>
  );
}
