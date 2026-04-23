import { Icon } from '@/components/atoms/Icon';
import Link from 'next/link';
import { LoginForm } from '@/components/molecules/LoginForm';

export default function LoginPage() {
  return (
    <div className="bg-background font-body text-on-background min-h-screen flex flex-col items-center justify-center p-6 selection:bg-secondary-fixed relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary-fixed-dim/10 blur-[120px] animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-secondary-fixed/20 blur-[120px] animate-pulse duration-[8s]"></div>
      </div>

      {/* Top Navigation Anchor */}
      <header className="w-full absolute top-0 flex justify-center items-center py-10 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Icon 
              name="school" 
              className="text-secondary-container text-4xl" 
              fill={true} 
            />
            <Icon 
              name="handshake" 
              className="text-primary-container absolute -bottom-1 -right-1 text-lg bg-surface rounded-full p-0.5" 
              fill={true} 
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline text-primary-container flex items-center">
            Maha<span className="text-secondary-container">Sewa</span>
          </h1>
        </div>
      </header>

      <main className="w-full max-w-md mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Authentication Card */}
        <div className="bg-surface-container-lowest shadow-[0_32px_64px_-16px_rgba(26,27,32,0.1)] rounded-2xl p-8 md:p-12 transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(26,27,32,0.15)] ring-1 ring-black/[0.03]">
          <div className="mb-10 text-center">
            <h2 className="font-headline text-3xl font-bold text-primary mb-3 tracking-tight">Selamat Datang Kembali</h2>
            <p className="text-on-surface-variant opacity-80 text-lg">Masuk untuk melanjutkan ke portal akademik Anda</p>
          </div>

          <LoginForm />

          {/* Social/Alumni Auth */}
          <div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-col items-center gap-4">
            <span className="text-xs font-label uppercase tracking-widest text-outline font-bold">Atau masuk dengan</span>
            <div className="flex gap-4 w-full">
              <button className="flex-1 flex items-center justify-center gap-3 py-4 px-4 bg-surface-container rounded-xl border border-transparent hover:bg-surface-container-high hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlvoEg-FnSHuRBnvdkaepDdnETQMMTNSHo2dA7c62wSOkSPzQxf0jN1T-CQJSgj31R4VYBMgQLuJdhoFUa1r5ypRtWVqgvnMsnKAj6eBDmawtwLJ4JM6Pmw0I9J2gDx_EH6sW6NmamLm4KEnxxJ73NoPVJyw9MaKw1rawGqc4PhENGwvIN3_IglLWHya4AYcKujcHfrM118S2BurfBc1SjraBstpc4BV90E7fnOMi1q4DbdJ_a3-EGYMomG2cslPxajIJAU1xnaIZF" 
                  alt="Google" 
                  className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all duration-300" 
                />
                <span className="text-sm font-bold text-on-surface">Akun Kampus</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center space-y-6 font-label">
          <p className="text-on-surface-variant text-lg">
            Belum punya akun?
            <Link href="/register" className="text-secondary font-extrabold hover:text-secondary-container transition-colors decoration-2 underline-offset-8 ml-2">
              Daftar sekarang
            </Link>
          </p>
          <div className="flex items-center justify-center gap-8 pt-4">
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-outline hover:text-primary transition-all hover:scale-110">Bantuan</Link>
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-outline hover:text-primary transition-all hover:scale-110">Privasi</Link>
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-outline hover:text-primary transition-all hover:scale-110">Syarat</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
