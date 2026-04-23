import React from "react";
import { getAllUsers } from "@/lib/actions/admin";
import { Icon } from "@/components/atoms/Icon";
import { UserManagementTable } from "@/components/organisms/UserManagementTable";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="font-headline text-[2.5rem] font-extrabold text-primary leading-tight -tracking-widest">
          Manajemen <span className="text-secondary-container">Pengguna</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl mt-2">
          Kelola seluruh partisipan platform, verifikasi identitas, dan moderasi akun.
        </p>
      </header>

      <section className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden border border-outline-variant/10">
        <UserManagementTable users={users} />
      </section>
    </div>
  );
}
