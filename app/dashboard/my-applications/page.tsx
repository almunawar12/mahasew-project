import React from "react";
import { getUserApplications } from "@/lib/actions/project";
import { Icon } from "@/components/atoms/Icon";
import { Badge } from "@/components/atoms/Badge";
import { formatRupiah, formatFullDate } from "@/lib/utils";
import Link from "next/link";

export default async function MyApplicationsPage() {
  const applications = await getUserApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "check_circle";
      case "REJECTED": return "cancel";
      default: return "pending";
    }
  };

  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-black text-primary mb-2">Lamaran Saya</h1>
        <p className="text-on-surface-variant">Lacak status lamaran proyek yang telah Anda kirimkan.</p>
      </header>

      {applications.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-20 text-center border-2 border-dashed border-outline-variant/50">
          <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="work_off" className="text-4xl text-outline" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Belum Ada Lamaran</h3>
          <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">
            Anda belum melamar proyek apapun. Jelajahi berbagai peluang menarik dan mulai bangun karier Anda.
          </p>
          <Link href="/cari-proyek">
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all">
              Cari Proyek Sekarang
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-all group overflow-hidden relative">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden shrink-0">
                  <img 
                    src={app.project.client.image || "https://ui-avatars.com/api/?name=" + app.project.client.name} 
                    alt={app.project.client.name || "Client"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-primary truncate">
                      {app.project.title}
                    </h3>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                      <Icon name={getStatusIcon(app.status)} className="text-sm" />
                      {app.status}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <Icon name="business" className="text-sm" />
                      {app.project.client.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-secondary font-bold">
                      <Icon name="payments" className="text-sm" />
                      Penawaran: {formatRupiah(app.amount)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="event" className="text-sm" />
                      Melamar pada {formatFullDate(app.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto shrink-0">
                  <Link href={`/proyek/${app.projectId}`} className="flex-grow md:flex-grow-0">
                    <button className="w-full px-6 py-2.5 rounded-xl border border-primary text-primary font-bold hover:bg-primary/5 transition-all text-sm">
                      Lihat Proyek
                    </button>
                  </Link>
                </div>
              </div>

              {/* Application Message Preview */}
              <div className="mt-4 pt-4 border-t border-outline-variant/10">
                <p className="text-sm text-on-surface-variant line-clamp-1 italic">
                  "{app.message}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
