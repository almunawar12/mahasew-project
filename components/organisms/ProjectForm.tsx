"use client";

import React, { useState } from "react";
import { Icon } from "../atoms/Icon";
import { createProject, updateProject } from "@/lib/actions/project";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProjectFormProps {
  project?: any;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>(project?.skills || ["UI/UX Design", "Python"]);
  const [skillInput, setSkillInput] = useState("");
  const [budgetType, setBudgetType] = useState(project?.budgetType || "FIXED");
  const [maxFreelancers, setMaxFreelancers] = useState<number>(project?.maxFreelancers || 1);

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      budget: parseFloat(formData.get("budget") as string),
      budgetType,
      skills,
      deadline: formData.get("deadline") as string,
      maxFreelancers,
    };

    try {
      if (project) {
        await updateProject(project.id, data);
        toast.success("Proyek berhasil diperbarui!");
      } else {
        await createProject(data);
        toast.success("Proyek berhasil diposting!");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(project ? "Gagal memperbarui proyek." : "Gagal memposting proyek. Pastikan semua data benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="font-headline text-[2.5rem] font-extrabold text-primary leading-tight -tracking-widest">
          Buat {project ? "Edit" : "Postingan"} <span className="text-secondary-container">Proyek {project ? "" : "Baru"}</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl mt-2">
          Hubungkan visi Anda dengan talenta terbaik dari komunitas alumni dan mahasiswa berprestasi.
        </p>
      </header>

      <section className="bg-surface-container-lowest rounded-xl editorial-shadow p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Judul Proyek */}
          <div className="space-y-2">
            <label className="block font-headline font-bold text-primary text-sm uppercase tracking-wider">
              Judul Proyek
            </label>
            <input
              name="title"
              required
              defaultValue={project?.title}
              className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-fixed-dim focus:bg-surface-container-lowest transition-all"
              placeholder="Contoh: Pengembangan Dashboard Analitik AI"
              type="text"
            />
          </div>

          {/* Deskripsi Detail */}
          <div className="space-y-2">
            <label className="block font-headline font-bold text-primary text-sm uppercase tracking-wider">
              Deskripsi Detail
            </label>
            <div className="rounded-lg border-2 border-surface-container-high overflow-hidden">
              <div className="bg-surface-container-low px-4 py-2 flex gap-4 border-b border-surface-container-high">
                <Icon name="format_bold" className="text-sm cursor-pointer hover:text-secondary-container" />
                <Icon name="format_italic" className="text-sm cursor-pointer hover:text-secondary-container" />
                <Icon name="format_list_bulleted" className="text-sm cursor-pointer hover:text-secondary-container" />
                <Icon name="attach_file" className="text-sm cursor-pointer hover:text-secondary-container" />
              </div>
              <textarea
                name="description"
                required
                defaultValue={project?.description}
                className="w-full p-4 border-none focus:ring-0 bg-surface-container-lowest resize-none"
                placeholder="Jelaskan detail proyek, output yang diharapkan, dan kriteria pengerjaan..."
                rows={8}
              />
            </div>
          </div>

          {/* Skill Tags */}
          <div className="space-y-2">
            <label className="block font-headline font-bold text-primary text-sm uppercase tracking-wider">
              Skill yang Dibutuhkan
            </label>
            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-surface-container-highest">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded-full flex items-center gap-2"
                >
                  {skill}
                  <Icon
                    name="close"
                    className="text-xs cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  />
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                className="bg-transparent border-none focus:ring-0 text-sm py-0 w-24"
                placeholder="Tambah skill..."
                type="text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget Type */}
            <div className="space-y-2">
              <label className="block font-headline font-bold text-primary text-sm uppercase tracking-wider">
                Tipe Budget
              </label>
              <div className="flex bg-surface-container-highest p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setBudgetType("FIXED")}
                  className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${
                    budgetType === "FIXED"
                      ? "bg-white text-primary shadow-sm"
                      : "text-on-surface-variant font-medium"
                  }`}
                >
                  Fixed Price
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType("HOURLY")}
                  className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${
                    budgetType === "HOURLY"
                      ? "bg-white text-primary shadow-sm"
                      : "text-on-surface-variant font-medium"
                  }`}
                >
                  Hourly Rate
                </button>
              </div>
            </div>

            {/* Budget Amount */}
            <div className="space-y-2">
              <label className="block font-headline font-bold text-primary text-sm uppercase tracking-wider">
                Budget (Rp)
              </label>
              <input
                name="budget"
                required
                defaultValue={project?.budget}
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-fixed-dim"
                placeholder="Misal: 5000000"
                type="number"
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="block font-headline font-bold text-primary text-sm uppercase tracking-wider">
                Deadline Proyek
              </label>
              <div className="relative">
                <input
                  name="deadline"
                  defaultValue={project?.deadline ? new Date(project.deadline).toISOString().split('T')[0] : ""}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-none pr-12 focus:ring-2 focus:ring-primary-fixed-dim"
                  type="date"
                />
              </div>
            </div>

            {/* Jumlah Freelancer */}
            <div className="space-y-2">
              <label className="block font-headline font-bold text-primary text-sm uppercase tracking-wider">
                Jumlah Freelancer Dibutuhkan
              </label>
              <input
                value={maxFreelancers}
                onChange={(e) => setMaxFreelancers(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                min={1}
                max={20}
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-fixed-dim"
                type="number"
                required
              />
              <p className="text-xs text-on-surface-variant">
                Berapa freelancer yang akan dipekerjakan? Budget di atas adalah <strong>per freelancer</strong>.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-primary-container text-white rounded-lg font-headline font-extrabold text-lg flex items-center justify-center gap-3 active:scale-95 transition-transform editorial-shadow disabled:opacity-50"
            >
              {loading ? "Memproses..." : project ? "Perbarui Proyek" : "Posting Proyek"}
              <Icon name="rocket_launch" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
