import { Icon } from '@/components/atoms/Icon';
import Link from 'next/link';
import { RegisterForm } from '@/components/molecules/RegisterForm';

export default function RegisterPage() {
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

      <main className="w-full max-w-md mt-16 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Authentication Card */}
        <div className="bg-surface-container-lowest shadow-[0_32px_64px_-16px_rgba(26,27,32,0.1)] rounded-2xl p-8 md:p-12 transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(26,27,32,0.15)] ring-1 ring-black/[0.03]">
          <div className="mb-10 text-center">
            <h2 className="font-headline text-3xl font-bold text-primary mb-3 tracking-tight">Bergabung Sekarang</h2>
            <p className="text-on-surface-variant opacity-80 text-lg">Mulai karir profesionalmu atau temukan talenta terbaik</p>
          </div>

          <RegisterForm />
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center space-y-6 font-label">
          <p className="text-on-surface-variant text-lg">
            Sudah punya akun?
            <Link href="/login" className="text-secondary font-extrabold hover:text-secondary-container transition-colors decoration-2 underline-offset-8 ml-2">
              Masuk di sini
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
