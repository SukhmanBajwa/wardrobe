"use client";
import "./ItemDetail.css";
import Image from "next/image";
import { X, RefreshCw } from "lucide-react";
import { useClothingItems } from "@/functions/clothingItems";
import { useAiRecommendations } from "@/functions/aiRecommendations";
import { useState, useEffect } from "react";
import RecommendationDetail from "@/components/RecommendationDetail";
import capitalize from "@/functions/capitalize";
export default function ItemDetail({
  item,
  onClose,
  onDelete,
  onEdit,
}: {
  item: ClothingItem;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const { deleteClothingItem } = useClothingItems({});
  const { getAiRecommendation, triggerRefresh } = useAiRecommendations(item.id);
  const [refreshingRecommendations, setRefreshingRecommendations] =
    useState<boolean>(false);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<AiRecommendation | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!getAiRecommendation.isFetching && refreshingRecommendations) {
      setRefreshingRecommendations(false);
    }
  }, [getAiRecommendation.isFetching]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {deleting && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-white mb-2">
                Delete item?
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleting(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition hover:bg-gray-100/5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteClothingItem.mutate(item.id);

                    onDelete!();
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg   transition hover:bg-red-500/50 hover:text-red-300 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-700/60 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-100">Item details</h1>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onEdit!();
                onClose();
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              Edit
            </button>
            {/* <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              Share
            </button> */}
            <button
              type="button"
              onClick={() => setDeleting(true)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 active:scale-95"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-gray-100 active:scale-95"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-6 md:flex-row">
          {/* Item */}
          <div className="flex flex-col gap-3 md:w-1/2">
            <Image
              src={item.image_url || "https://picsum.photos/id/237/500/700"}
              alt={item.name}
              width={320}
              height={320}
              className="h-64 w-64 rounded-xl object-cover ring-1 ring-white/10"
              priority
            />

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

          {/* Recommendations */}
          <div className="md:w-1/2 md:border-l md:border-gray-700/60 md:pl-6">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-bold text-white">Pairs well with</h2>
              <button
                type="button"
                // .refetch to re run the querry, but technically we manually running the querry, as auto run is false in hook for this querry
                onClick={() => {
                  setRefreshingRecommendations(true);
                  triggerRefresh();
                }}
                title="Refresh AI recommendations"
                aria-label="Refresh AI recommendations"
                className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white active:scale-95"
              >
                <RefreshCw size={18} aria-hidden="true" />
              </button>
            </div>

            {getAiRecommendation.isLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl bg-gray-900/80 p-2 animate-pulse"
                  >
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-700" />
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="h-3 w-1/2 rounded bg-gray-700" />
                      <div className="h-3 w-3/4 rounded bg-gray-700" />
                      <div className="h-3 w-2/3 rounded bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : refreshingRecommendations ? (
              <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
                <RefreshCw
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
                Loading recommendations…
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {getAiRecommendation.data &&
                  getAiRecommendation.data.map(
                    (rec: AiRecommendation, index: number) => (
                      <div
                        key={index}
                        className="flex cursor-pointer flex-row items-center gap-3 rounded-2xl border border-transparent bg-gray-900/80 p-2 transition hover:border-gray-700 hover:bg-gray-950"
                        onClick={() => setSelectedRecommendation(rec)}
                      >
                        <Image
                          src={
                            rec.recommended_item.image_url ||
                            "https://picsum.photos/id/237/500/700"
                          }
                          alt={rec.recommended_item.name}
                          width={100}
                          height={100}
                          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                          priority
                        />
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-medium text-white">
                            {rec.recommended_item.name}
                          </h3>
                          <p className="text-xs text-gray-400">{rec.reason}</p>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            )}
          </div>

          {selectedRecommendation && (
            <RecommendationDetail
              recommendation={selectedRecommendation}
              onClose={() => setSelectedRecommendation(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
