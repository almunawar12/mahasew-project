import React from 'react';
import { Logo } from '../molecules/Logo';
import { Icon } from '../atoms/Icon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-20 px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Logo className="text-white mb-6 block" />
          <p className="text-on-primary-container text-sm leading-relaxed max-w-xs">
            Platform kolaborasi prestisius untuk mahasiswa berbakat dan alumni profesional di seluruh Indonesia.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Navigasi</h5>
          <ul className="space-y-4 text-on-primary-container text-sm font-medium">
            <li><a className="hover:text-white transition-colors" href="#">Cari Proyek</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Posting Proyek</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Dashboard Saya</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Dukungan</h5>
          <ul className="space-y-4 text-on-primary-container text-sm font-medium">
            <li><a className="hover:text-white transition-colors" href="#">Pusat Bantuan</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Syarat & Ketentuan</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Kebijakan Privasi</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Berlangganan</h5>
          <div className="flex bg-white/10 rounded-lg p-1">
            <input className="bg-transparent border-none focus:ring-0 text-white text-sm px-4 w-full placeholder:text-white/30" placeholder="Email kamu..." type="email" />
            <button className="bg-secondary-container p-2 rounded-md hover:brightness-110 transition-all">
              <Icon name="send" className="text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-on-primary-container text-[10px] font-bold tracking-widest uppercase">© 2024 MahaSewa Indonesia. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a className="text-on-primary-container hover:text-white transition-colors" href="#"><Icon name="social_leaderboard" className="text-xl" /></a>
          <a className="text-on-primary-container hover:text-white transition-colors" href="#"><Icon name="camera" className="text-xl" /></a>
          <a className="text-on-primary-container hover:text-white transition-colors" href="#"><Icon name="share" className="text-xl" /></a>
        </div>
      </div>
    </footer>
  );
};
