import React from "react";
import { ProjectForm } from "@/components/organisms/ProjectForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Icon } from "@/components/atoms/Icon";

export default async function PostJobPage() {
  const session = await auth();

  if (!session || session.user?.role !== "OWNER") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Section (Form) */}
      <div className="lg:col-span-8">
        <ProjectForm />
      </div>

      {/* Right Section (Stats / Tips) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Project Status Summary (Small) */}
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
          <h2 className="font-headline font-bold text-primary text-lg mb-6 flex items-center justify-between">
            Status Proyek Saya
            <Icon name="analytics" className="text-secondary-container" />
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm border-l-4 border-secondary-container">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Aktif / Berjalan</p>
                <p className="text-2xl font-black text-primary">0</p>
              </div>
              <Icon name="running_with_errors" className="text-secondary-container/20 text-4xl" fill />
            </div>
          </div>
        </div>

        {/* Tips / CTA Card */}
        <div className="relative overflow-hidden bg-primary-container rounded-2xl p-6 text-on-primary shadow-xl">
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-lg mb-2">Punya Pertanyaan?</h3>
            <p className="text-sm opacity-80 mb-6 leading-relaxed">
              Panduan posting proyek kami membantu Anda mendapatkan kandidat 3x lebih cepat.
            </p>
            <a className="inline-flex items-center gap-2 text-secondary-container bg-white px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform" href="#">
              Baca Panduan <Icon name="arrow_forward" className="text-sm" />
            </a>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
