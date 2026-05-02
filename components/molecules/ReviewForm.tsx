"use client";

import React, { useState } from "react";
import { createReview } from "@/lib/actions/review";
import { StarRating } from "./StarRating";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ReviewForm = ({ projectId, targetName }: { projectId: string; targetName: string }) => {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReview({ projectId, rating, comment });
      toast.success("Review terkirim.");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-outline-variant/10 space-y-4">
      <h3 className="font-bold text-primary">Beri Review untuk {targetName}</h3>

      <div>
        <label className="block text-sm font-bold mb-2">Rating</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Komentar (opsional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagaimana pengalaman kerja sama?"
          className="w-full p-3 border border-outline-variant rounded-xl text-sm"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? "Mengirim..." : "Kirim Review"}
      </button>
    </form>
  );
};
