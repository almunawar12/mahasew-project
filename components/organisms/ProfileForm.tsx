"use client";

import React, { useState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/atoms/Icon";

interface Initial {
  fullName: string;
  bio: string;
  university: string;
  phoneNumber: string;
  skills: string[];
  portfolioUrl: string;
  avatarUrl: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  ewalletProvider: string;
  ewalletNumber: string;
}

export const ProfileForm = ({ initial, showStudentFields }: { initial: Initial; showStudentFields: boolean }) => {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof Initial>(k: K, v: Initial[K]) => setData((d) => ({ ...d, [k]: v }));

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (data.skills.includes(v)) return;
    set("skills", [...data.skills, v]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => set("skills", data.skills.filter((x) => x !== s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success("Profil tersimpan.");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Informasi Dasar" icon="person">
        <Field label="Nama Lengkap">
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className="w-full p-3 border border-outline-variant rounded-xl"
            required
          />
        </Field>
        <Field label="URL Foto Profil (avatar)">
          <input
            type="url"
            value={data.avatarUrl}
            onChange={(e) => set("avatarUrl", e.target.value)}
            placeholder="https://..."
            className="w-full p-3 border border-outline-variant rounded-xl"
          />
        </Field>
        <Field label="Nomor HP / WhatsApp">
          <input
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => set("phoneNumber", e.target.value)}
            placeholder="+628..."
            className="w-full p-3 border border-outline-variant rounded-xl"
          />
        </Field>
        <Field label="Bio Singkat">
          <textarea
            value={data.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="Ceritakan tentang diri Anda..."
            rows={4}
            className="w-full p-3 border border-outline-variant rounded-xl"
          />
        </Field>
      </Section>

      {showStudentFields && (
        <>
          <Section title="Akademik & Portofolio" icon="school">
            <Field label="Universitas / Kampus">
              <input
                type="text"
                value={data.university}
                onChange={(e) => set("university", e.target.value)}
                placeholder="Contoh: Universitas Indonesia"
                className="w-full p-3 border border-outline-variant rounded-xl"
              />
            </Field>
            <Field label="URL Portofolio">
              <input
                type="url"
                value={data.portfolioUrl}
                onChange={(e) => set("portfolioUrl", e.target.value)}
                placeholder="https://github.com/... atau https://behance.net/..."
                className="w-full p-3 border border-outline-variant rounded-xl"
              />
            </Field>
            <Field label="Keahlian (Skills)">
              <div className="flex flex-wrap gap-2 mb-2">
                {data.skills.map((s) => (
                  <span key={s} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="hover:bg-primary/20 rounded-full p-0.5">
                      <Icon name="close" className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Contoh: React, Figma, Copywriting..."
                  className="flex-1 p-3 border border-outline-variant rounded-xl"
                />
                <button type="button" onClick={addSkill} className="px-4 bg-primary text-white rounded-xl font-bold">
                  Tambah
                </button>
              </div>
            </Field>
          </Section>

          <Section title="Metode Pembayaran" icon="account_balance">
            <p className="text-sm text-on-surface-variant -mt-2 mb-2">
              Wajib diisi agar admin bisa meneruskan dana setelah proyek selesai. Pilih salah satu (bank atau e-wallet).
            </p>
            <Field label="Nama Bank">
              <input
                type="text"
                value={data.bankName}
                onChange={(e) => set("bankName", e.target.value)}
                placeholder="Contoh: BCA, Mandiri, BNI..."
                className="w-full p-3 border border-outline-variant rounded-xl"
              />
            </Field>
            <Field label="No. Rekening">
              <input
                type="text"
                value={data.bankAccountNumber}
                onChange={(e) => set("bankAccountNumber", e.target.value)}
                className="w-full p-3 border border-outline-variant rounded-xl"
              />
            </Field>
            <Field label="Atas Nama Rekening">
              <input
                type="text"
                value={data.bankAccountName}
                onChange={(e) => set("bankAccountName", e.target.value)}
                placeholder="Sesuai buku tabungan"
                className="w-full p-3 border border-outline-variant rounded-xl"
              />
            </Field>
            <div className="border-t border-outline-variant/20 my-2"></div>
            <Field label="E-Wallet (alternatif)">
              <select
                value={data.ewalletProvider}
                onChange={(e) => set("ewalletProvider", e.target.value)}
                className="w-full p-3 border border-outline-variant rounded-xl"
              >
                <option value="">— Pilih —</option>
                <option value="GoPay">GoPay</option>
                <option value="OVO">OVO</option>
                <option value="DANA">DANA</option>
                <option value="ShopeePay">ShopeePay</option>
                <option value="LinkAja">LinkAja</option>
              </select>
            </Field>
            <Field label="No. E-Wallet">
              <input
                type="text"
                value={data.ewalletNumber}
                onChange={(e) => set("ewalletNumber", e.target.value)}
                placeholder="No. HP terdaftar"
                className="w-full p-3 border border-outline-variant rounded-xl"
              />
            </Field>
          </Section>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
};

const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-4">
    <h3 className="font-bold text-primary flex items-center gap-2">
      <Icon name={icon} />
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-bold text-on-surface mb-2">{label}</label>
    {children}
  </div>
);
