import React from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { getProjectById } from "@/lib/actions/project";
import { notFound } from "next/navigation";
import { formatRupiah, formatFullDate } from "@/lib/utils";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { Button } from "@/components/atoms/Button";
import { ApplyButton } from "@/components/organisms/ApplyButton";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prismadb";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  const session = await auth();

  if (!project) {
    notFound();
  }

  const daysRemaining = project.deadline 
    ? Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const hasApplied = project.bids.some(bid => bid.userId === session?.user?.id);

  let isVerified = false;
  if (session?.user?.id && session.user.role === "USER") {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { verificationStatus: true },
    });
    isVerified = profile?.verificationStatus === "VERIFIED";
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-12">
            <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
            <Icon name="chevron_right" className="text-xs" />
            <Link href="/cari-proyek" className="hover:text-primary transition-colors">Cari Proyek</Link>
            <Icon name="chevron_right" className="text-xs" />
            <span className="text-on-surface font-medium truncate max-w-[200px]">{project.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <header>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="premium">Proyek Aktif</Badge>
                  {project.budget > 1000000 && <Badge variant="flash">High Budget</Badge>}
                </div>
                <h1 className="font-headline text-4xl md:text-5xl font-black text-primary leading-tight mb-8">
                  {project.title}
                </h1>
                <Link href={`/profil/${project.clientId}`} className="flex items-center gap-6 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all">
                  <img
                    src={project.client.image || "https://ui-avatars.com/api/?name=" + project.client.name}
                    alt={project.client.name || "Client"}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-primary">{project.client.name}</h4>
                    <p className="text-on-surface-variant">{project.client.profile?.university || "MahaSewa Client"}</p>
                  </div>
                  <Icon name="chevron_right" className="ml-auto text-outline" />
                </Link>
              </header>

              <section className="space-y-6">
                <h3 className="text-2xl font-bold text-primary flex items-center gap-3">
                  <Icon name="description" className="text-secondary" />
                  Deskripsi Proyek
                </h3>
                <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed">
                  {project.description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-2xl font-bold text-primary flex items-center gap-3">
                  <Icon name="construction" className="text-secondary" />
                  Keahlian yang Dibutuhkan
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="skill" className="text-base py-2 px-4">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar Stats & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                <div className="bg-primary-container text-white rounded-3xl p-8 shadow-2xl shadow-primary/20">
                  <div className="space-y-6 mb-8">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-1">Total Budget</p>
                      <p className="text-3xl font-black text-secondary-container">{formatRupiah(project.budget)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-1">Tenggat Waktu</p>
                      <p className="text-xl font-bold">{project.deadline ? formatFullDate(project.deadline) : "Fleksibel"}</p>
                      {daysRemaining !== null && (
                        <p className="text-sm text-secondary-container mt-1 font-bold">
                          {daysRemaining > 0 ? `${daysRemaining} hari lagi` : "Sudah lewat"}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {session?.user?.role === "USER" ? (
                    <ApplyButton projectId={project.id} defaultBudget={project.budget} hasApplied={hasApplied} isVerified={isVerified} />
                  ) : session?.user?.role === "OWNER" ? (
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                        <p className="text-sm font-medium">Anda adalah pemilik proyek ini</p>
                    </div>
                  ) : (
                    <Link href="/login" className="block">
                      <Button variant="on-primary" size="lg" className="w-full text-xl py-6 rounded-2xl">
                        Login untuk Melamar
                      </Button>
                    </Link>
                  )}
                  
                  <p className="text-center text-xs text-white/40 mt-4">
                    Pastikan profil Anda sudah lengkap sebelum melamar.
                  </p>
                </div>

                <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 space-y-6">
                  <h4 className="font-bold text-primary">Informasi Tambahan</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Terdaftar sejak</span>
                      <span className="font-bold text-primary">{formatFullDate(project.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Jumlah Pelamar</span>
                      <span className="font-bold text-primary">{project.bids.length} Orang</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
