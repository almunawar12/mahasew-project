import React from "react";
import { auth } from "@/auth";
import { Icon } from "@/components/atoms/Icon";
import { DashboardCharts } from "@/components/organisms/DashboardCharts";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role;
  const name = session?.user?.name || "User";

  const isOwner = role === "OWNER";

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Section (Main Content) */}
      <div className="lg:col-span-8 space-y-10">
        <header>
          <h1 className="font-headline text-[2.5rem] font-extrabold text-primary leading-tight -tracking-widest">
            {isOwner ? "Ringkasan" : "Dashboard"} <span className="text-secondary-container">Saya</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl mt-2">
            {isOwner 
              ? "Kelola lowongan proyek Anda dan temukan talenta mahasiswa terbaik di sini."
              : "Pantau status lamaran Anda dan temukan peluang proyek baru yang sesuai dengan keahlian Anda."}
          </p>
        </header>

        {/* Welcome Card / Chart Section */}
        <section className="bg-surface-container-lowest rounded-xl editorial-shadow p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-bold text-primary text-xl">Overview Performa</h2>
            <div className="flex bg-surface-container-highest p-1 rounded-lg">
               <button className="px-4 py-1.5 rounded-md bg-white text-primary font-bold text-xs shadow-sm">Minggu Ini</button>
               <button className="px-4 py-1.5 rounded-md text-on-surface-variant font-medium text-xs">Bulan Ini</button>
            </div>
          </div>
          
          <DashboardCharts />
        </section>

        {/* Recent Activity (Asymmetric Card style) */}
        <section className="bg-surface rounded-xl p-8 border border-outline-variant/10">
          <h3 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
             <Icon name="history" className="text-secondary-container" />
             Aktivitas Terakhir
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-secondary-container mt-1.5 shadow-[0_0_10px_rgba(253,139,0,0.5)]"></div>
              <div className="text-sm">
                <p className="text-on-surface font-bold">Berhasil mendaftar di MahaSewa</p>
                <p className="text-xs text-on-surface-variant">Selamat datang di platform!</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">Baru saja</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-60 grayscale">
              <div className="w-2 h-2 rounded-full bg-outline mt-1.5"></div>
              <div className="text-sm">
                <p className="text-on-surface font-medium">Lengkapi profil Anda</p>
                <p className="text-xs text-on-surface-variant">Tambahkan data universitas dan skill.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Section (Stats Sidebar) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Project Status Cards */}
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
          <h2 className="font-headline font-bold text-primary text-lg mb-6 flex items-center justify-between">
            Status Terkini
            <Icon name="analytics" className="text-secondary-container" />
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl editorial-shadow border-l-4 border-secondary-container transition-transform hover:-translate-x-1 duration-200">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Aktif / Berjalan</p>
                <p className="text-3xl font-black text-primary">0</p>
              </div>
              <Icon name="running_with_errors" className="text-secondary-container/20 text-5xl" fill />
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl editorial-shadow border-l-4 border-primary transition-transform hover:-translate-x-1 duration-200">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Menunggu Review</p>
                <p className="text-3xl font-black text-primary">0</p>
              </div>
              <Icon name="rate_review" className="text-primary/20 text-5xl" fill />
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl editorial-shadow border-l-4 border-success transition-transform hover:-translate-x-1 duration-200">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Selesai</p>
                <p className="text-3xl font-black text-primary">0</p>
              </div>
              <Icon name="task_alt" className="text-success/20 text-5xl" fill />
            </div>
          </div>
        </div>

        {/* Tips / CTA Card */}
        <div className="relative overflow-hidden bg-primary-container rounded-2xl p-6 text-on-primary shadow-xl">
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-lg mb-2">Butuh Bantuan?</h3>
            <p className="text-sm opacity-80 mb-6 leading-relaxed">
              Tim MahaSewa siap membantu Anda dalam proses pencarian atau posting proyek.
            </p>
            <a className="inline-flex items-center gap-2 text-secondary-container bg-white px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform" href="#">
              Baca Panduan <Icon name="arrow_forward" className="text-sm" />
            </a>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
