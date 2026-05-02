"use client";

import React from "react";
import { Icon } from "@/components/atoms/Icon";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

export const StarRating = ({ value, onChange, size = "md", readOnly }: Props) => {
  const sizeMap = { sm: "text-base", md: "text-2xl", lg: "text-4xl" };
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={`${sizeMap[size]} ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Icon
            name="star"
            fill={n <= value}
            className={n <= value ? "text-yellow-500" : "text-outline"}
          />
        </button>
      ))}
    </div>
  );
};
