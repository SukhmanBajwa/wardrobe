"use client";

import { useClothingItems } from "@/functions/clothingItems";
import { X, Trash2 } from "lucide-react";

export default function Tags({ onClose }: { onClose: () => void }) {
  const { getTags, deleteTag } = useClothingItems({});

  const tagsAvailable = getTags.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-700/60 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-100">Tags</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-gray-100 active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-wrap gap-2">
            {tagsAvailable &&
              tagsAvailable.map((tag: Tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900/50 px-3 py-1 text-sm text-gray-200"
                >
                  #{tag.name}
                  <button
                    type="button"
                    onClick={() => deleteTag.mutateAsync(tag)}
                    aria-label={`Delete ${tag.name}`}
                    className="rounded-full p-0.5 text-gray-500 transition hover:bg-red-500/15 hover:text-red-400 active:scale-90"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </span>
              ))}

            {tagsAvailable && tagsAvailable.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-500">
                No tags yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
