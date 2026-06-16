"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import capitalize from "@/functions/capitalize";

export default function RecommendationDetail({
  recommendation,
  onClose,
}: {
  recommendation: AiRecommendation;
  onClose: () => void;
}) {
  const item = recommendation.recommended_item;
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Recommended item details"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700/60 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-100">Item details</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-gray-100 active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-6 sm:flex-row">
          {/* Image */}
          <div className="shrink-0">
            <Image
              src={item.image_url || "https://picsum.photos/id/237/500/700"}
              alt={item.name}
              width={320}
              height={320}
              className="h-64 w-64 rounded-xl object-cover ring-1 ring-white/10"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col gap-3">
            <span className="inline-block w-fit rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
              {capitalize(item.category)}
            </span>

            <h2 className="text-2xl font-bold text-gray-100">{item.name}</h2>

            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-sm font-light text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-gray-700/60" />

            <p className="leading-relaxed text-gray-300">
              {capitalize(item.description)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
