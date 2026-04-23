import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prismadb";
import { ApplicantCard } from "@/components/organisms/ApplicantCard";
import { Icon } from "@/components/atoms/Icon";

export default async function ApplicantsPage() {
  const session = await auth();

  if (!session || session.user?.role !== "OWNER") {
    redirect("/dashboard");
  }

  // Fetch bids for projects owned by this user
  const bids = await prisma.bid.findMany({
    where: {
      project: {
        clientId: session.user.id
      }
    },
    include: {
      project: true,
      user: {
        include: {
          profile: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const pendingBids = bids.filter(b => b.status === "PENDING");
  const processedBids = bids.filter(b => b.status !== "PENDING");

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="font-headline text-[2.5rem] font-extrabold text-primary leading-tight -tracking-widest">
          Manajemen <span className="text-secondary-container">Pelamar</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mt-2">
          Tinjau aplikasi mahasiswa yang masuk dan pilih kandidat terbaik untuk mempercepat riset atau proyek Anda.
        </p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low rounded-2xl p-6 border-b-4 border-primary shadow-sm">
           <div className="flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Total Pelamar</p>
                 <p className="text-3xl font-black text-primary">{bids.length}</p>
              </div>
              <Icon name="groups" className="text-4xl text-primary/20" fill />
           </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 border-b-4 border-secondary shadow-sm">
           <div className="flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Perlu Review</p>
                 <p className="text-3xl font-black text-secondary">{pendingBids.length}</p>
              </div>
              <Icon name="pending_actions" className="text-4xl text-secondary/20" fill />
           </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 border-b-4 border-success shadow-sm">
           <div className="flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Diterima (Hired)</p>
                 <p className="text-3xl font-black text-success">{bids.filter(b => b.status === "ACCEPTED").length}</p>
              </div>
              <Icon name="person_add" className="text-4xl text-success/20" fill />
           </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-12">
        {/* Pending Applicants */}
        <section>
          <h2 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(253,139,0,0.5)]"></div>
             Menunggu Review ({pendingBids.length})
          </h2>
          {pendingBids.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-20 text-center border-2 border-dashed border-outline-variant">
               <Icon name="inbox_customize" className="text-6xl mb-4 opacity-10" />
               <p className="text-on-surface-variant font-medium">Belum ada pelamar baru yang perlu ditinjau.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBids.map(bid => (
                <ApplicantCard key={bid.id} bid={bid} />
              ))}
            </div>
          )}
        </section>

        {/* Historis / Processed Applicants */}
        {processedBids.length > 0 && (
          <section>
            <h2 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6 flex items-center gap-2 opacity-60">
               <div className="w-1.5 h-1.5 rounded-full bg-outline"></div>
               Riwayat Keputusan
            </h2>
            <div className="space-y-4 opacity-80 grayscale-[0.2]">
              {processedBids.map(bid => (
                <ApplicantCard key={bid.id} bid={bid} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
