'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';
import { login } from '@/lib/actions/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(formData);
      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        toast.success("Berhasil masuk! Mengalihkan...");
        if (result.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi");
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase opacity-70" htmlFor="email">
          Email Kampus / Alumni
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
            <Icon name="mail" className="text-[20px]" />
          </div>
          <input
            type="email"
            id="email"
            required
            placeholder="nama@kampus.ac.id"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-fixed-dim focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60 outline-none"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase opacity-70" htmlFor="password">
            Kata Sandi
          </label>
          <Link href="#" className="text-sm font-medium text-primary-container hover:text-secondary-container transition-colors">
            Lupa Kata Sandi?
          </Link>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
            <Icon name="lock" className="text-[20px]" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            placeholder="••••••••"
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

      {/* Remember Me */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="remember"
          checked={formData.remember}
          onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
          className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-fixed-dim bg-surface-container-highest transition-all cursor-pointer"
        />
        <label className="text-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
          Ingat saya di perangkat ini
        </label>
      </div>

      {/* CTA Button */}
      <Button 
        variant="primary" 
        type="submit" 
        disabled={isLoading}
        className="w-full py-4 shadow-lg shadow-secondary-container/20 group relative overflow-hidden"
      >
        <span className={isLoading ? 'opacity-0' : 'flex items-center gap-2'}>
          <span>Masuk</span>
          <Icon name="arrow_forward" className="text-[20px] group-hover:translate-x-1 transition-transform" />
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
