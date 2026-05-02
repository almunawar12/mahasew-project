import React from "react";
import { getPlatformSettings } from "@/lib/actions/settings";
import { SettingsForm } from "@/components/molecules/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getPlatformSettings();

  return (
    <div className="space-y-8 p-6 max-w-2xl">
      <header>
        <h1 className="text-3xl font-black text-primary mb-2">Pengaturan Platform</h1>
        <p className="text-on-surface-variant">
          Atur komisi platform dan informasi rekening untuk pembayaran escrow.
        </p>
      </header>

      <SettingsForm
        initial={{
          commissionPct: settings.commissionPct,
          bankName: settings.bankName || "",
          bankAccountNumber: settings.bankAccountNumber || "",
          bankAccountName: settings.bankAccountName || "",
        }}
      />
    </div>
  );
}
