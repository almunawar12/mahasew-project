"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '../molecules/Logo';
import { UserMenu } from '../molecules/UserMenu';
import { Icon } from '../atoms/Icon';

interface NavbarContentProps {
  user?: any;
}

export const NavbarContent: React.FC<NavbarContentProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Cari Proyek", href: "/cari-proyek", ownerOnly: false },
    { name: "Posting Proyek", href: "/posting-proyek", ownerOnly: true },
    { name: "Dashboard Saya", href: "/dashboard", ownerOnly: false },
  ];

  const filteredItems = menuItems.filter(item => !item.ownerOnly || user?.role === 'OWNER');

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm px-6 md:px-8 h-20 flex justify-between items-center transition-all duration-300">
      <div className="flex items-center gap-12">
        <Logo />
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {filteredItems.map(item => (
            <Link 
              key={item.href}
              href={item.href}
              className="text-on-surface-variant font-medium opacity-80 hover:text-secondary-container transition-colors duration-300 py-1"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop User Menu */}
        <div className="hidden md:block">
          <UserMenu user={user} />
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
        >
          <Icon name={isMenuOpen ? "close" : "menu"} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed left-0 top-20 w-full h-[calc(100vh-5rem)] bg-[#faf8ff] z-[100] transition-all duration-300 ease-in-out md:hidden flex flex-col ${
        isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      }`}>
        <div className="flex flex-col p-8 gap-10 overflow-y-auto h-full">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Menu</p>
            <div className="flex flex-col gap-6">
              {filteredItems.map(item => (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-headline font-extrabold text-[#00113a] active:text-[#fd8b00] transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-auto border-t border-outline-variant/10 pt-8 pb-20">
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
};
