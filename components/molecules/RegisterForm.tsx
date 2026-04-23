'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';
import { register } from '@/lib/actions/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'USER' // "USER" is for Student in our schema
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await register(formData);
      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        toast.success("Akun berhasil dibuat! Silakan masuk.");
        router.push("/login");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi");
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase opacity-70" htmlFor="name">
          Nama Lengkap
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
            <Icon name="person" className="text-[20px]" />
          </div>
          <input
            type="text"
            id="name"
            required
            placeholder="Contoh: Rifki Mahardika"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-fixed-dim focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60 outline-none"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase opacity-70" htmlFor="email">
          Email Kampus / Umum
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
            <Icon name="mail" className="text-[20px]" />
          </div>
          <input
            type="email"
            id="email"
            required
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-fixed-dim focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60 outline-none"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase opacity-70" htmlFor="password">
          Kata Sandi
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
            <Icon name="lock" className="text-[20px]" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            placeholder="Minimal 8 karakter"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-11 pr-12 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-fixed-dim focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60 outline-none"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary-container transition-colors"
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
          </button>
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase opacity-70">
          Saya Bergabung Sebagai
        </label>
        <div className="grid grid-cols-2 gap-4">
           <button 
             type="button"
             onClick={() => setFormData({...formData, role: 'USER'})}
             className={`p-4 rounded-xl border-2 transition-all flex flex-col gap-2 items-center ${
               formData.role === 'USER' ? "border-primary-container bg-primary-container/5" : "border-outline-variant hover:bg-surface-container-low"
             }`}
           >
              <Icon name="school" className={formData.role === 'USER' ? "text-primary-container" : "text-outline"} />
              <span className={`text-xs font-bold ${formData.role === 'USER' ? "text-primary-container" : "text-on-surface-variant"}`}>Mahasiswa</span>
           </button>
           <button 
             type="button"
             onClick={() => setFormData({...formData, role: 'OWNER'})}
             className={`p-4 rounded-xl border-2 transition-all flex flex-col gap-2 items-center ${
               formData.role === 'OWNER' ? "border-secondary-container bg-secondary-container/5" : "border-outline-variant hover:bg-surface-container-low"
             }`}
           >
              <Icon name="business_center" className={formData.role === 'OWNER' ? "text-secondary-container" : "text-outline"} />
              <span className={`text-xs font-bold ${formData.role === 'OWNER' ? "text-secondary-container" : "text-on-surface-variant"}`}>Project Owner</span>
           </button>
        </div>
      </div>

      {/* CTA Button */}
      <Button 
        variant="primary" 
        type="submit" 
        disabled={isLoading}
        className="w-full py-4 shadow-lg shadow-secondary-container/20 group relative overflow-hidden mt-4"
      >
        <span className={isLoading ? 'opacity-0' : 'flex items-center gap-2'}>
          <span>Daftar Sekarang</span>
          <Icon name="person_add" className="text-[20px] group-hover:translate-x-1 transition-transform" />
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </Button>
    </form>
  );
};
