"use client";

import React from "react";
import { Icon } from "../atoms/Icon";

interface StudentProfileViewProps {
  user: any;
  onClose: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ user, onClose }) => {
  const profile = user.profile;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-3xl overflow-hidden editorial-shadow flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white md:text-on-surface hover:bg-white/20 md:hover:bg-surface-container-high transition-all flex items-center justify-center"
        >
          <Icon name="close" />
        </button>

        {/* Sidebar (Identity) */}
        <div className="w-full md:w-80 bg-primary-container p-8 text-on-primary shrink-0 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-3xl bg-white/10 border-4 border-white/20 overflow-hidden mb-6 shadow-2xl">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <Icon name="person" className="text-6xl mt-4" />
            )}
          </div>
          <h2 className="font-headline font-bold text-2xl mb-1 leading-tight">{user.name}</h2>
          <p className="text-sm opacity-80 mb-6 font-medium">{profile?.university || "Mahasiswa MahaSewa"}</p>
          
          <div className="w-full space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 text-left">
              <Icon name="mail" className="text-xl opacity-60" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-black opacity-40">Email</p>
                <p className="text-xs font-bold truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <Icon name="call" className="text-xl opacity-60" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-black opacity-40">Telepon</p>
                <p className="text-xs font-bold">{profile?.phoneNumber || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex-grow p-8 overflow-y-auto bg-surface-container-lowest">
          <section className="mb-10">
            <h3 className="font-headline font-extrabold text-primary text-xl mb-4 flex items-center gap-2">
               <Icon name="description" className="text-secondary-container" />
               Tentang Saya
            </h3>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              {profile?.bio || "Pelamar ini belum menambahkan bio deskripsi diri."}
            </p>
          </section>

          <section className="mb-10">
            <h3 className="font-headline font-extrabold text-primary text-xl mb-4 flex items-center gap-2">
               <Icon name="auto_awesome" className="text-secondary-container" />
               Keahlian Utama
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills.length > 0 ? (
                profile.skills.map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-surface-container-high text-primary font-black text-[10px] rounded-lg uppercase tracking-widest shadow-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant italic">Belum ada skill yang ditambahkan.</p>
              )}
            </div>
          </section>

          <section className="mb-6">
            <h3 className="font-headline font-extrabold text-primary text-xl mb-4 flex items-center gap-2">
               <Icon name="link" className="text-secondary-container" />
               Tautan & Karya
            </h3>
            {profile?.portfolioUrl ? (
              <a 
                href={profile.portfolioUrl} 
                target="_blank" 
                className="inline-flex items-center gap-3 p-4 bg-white rounded-xl border border-outline-variant/10 hover:border-secondary transition-all editorial-shadow group w-full"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Icon name="language" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">Kunjungi Portofolio / GitHub</p>
                  <p className="text-[10px] text-on-surface-variant italic">{profile.portfolioUrl}</p>
                </div>
                <Icon name="open_in_new" className="ml-auto text-on-surface-variant" />
              </a>
            ) : (
              <p className="text-xs text-on-surface-variant italic">Mahasiswa belum melampirkan portofolio resmi.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
