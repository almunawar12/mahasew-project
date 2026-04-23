import React from 'react';
import Link from 'next/link';
import { Avatar } from '../atoms/Avatar';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';

interface UserMenuProps {
  user?: {
    name?: string | null;
    image?: string | null;
    role?: string | null;
    isVerified?: boolean;
  };
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" size="sm">Masuk</Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" size="sm">Daftar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <button className="p-2 text-on-surface-variant hover:text-primary transition-transform active:scale-95">
        <Icon name="notifications" />
      </button>
      <Link href="/dashboard" className="flex items-center gap-3 pl-4 border-l border-outline-variant/30 hover:opacity-80 transition-opacity">
        <Avatar 
          src={user.image || "https://img.icons8.com/parakeet/96/user.png"}
          alt={user.name || "User"}
          verified={user.isVerified}
        />
        <div className="hidden lg:block">
          <p className="text-sm font-bold text-primary leading-tight">{user.name}</p>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">{user.role || 'Member'}</p>
        </div>
      </Link>
    </div>
  );
};
