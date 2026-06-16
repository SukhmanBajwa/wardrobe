"use client";
import { X } from "lucide-react";
import { useClothingItems } from "@/functions/clothingItems";
import { useState } from "react";
import capitalize from "@/functions/capitalize";
import { Pencil } from "lucide-react";
export default function Categories({ onClose }: { onClose: () => void }) {
  const { getCategories, addCategory, editCategory, deleteCategory } =
    useClothingItems({});

  const categoriesAvailable = getCategories.data;

  const [editCategoryToggle, setEditCategoryToggle] = useState<number | null>(
    null,
  );

  const [newCategory, setNewCategory] = useState<string | null | undefined>(
    null,
  );
  const [editedCategory, setEditedCategory] = useState<
    string | null | undefined
  >();
  const sendEditForCategory = (id: number, name: string) => {
    const category: Category = { id, name };
    editCategory.mutateAsync(category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-700/60 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-100">Categories</h1>
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
          {/* New category form */}
          <div className="flex flex-row items-center gap-2">
            <input
              name="new category"
              placeholder="Add new category"
              maxLength={20}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  addCategory.mutateAsync(newCategory!);
                  setNewCategory(null);
                }
              }}
              value={newCategory ?? ""}
            />
            <button
              type="button"
              disabled={!newCategory}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
              onClick={() => {
                addCategory.mutateAsync(newCategory!);
                setNewCategory(null);
              }}
            >
              Add
            </button>
          </div>

          {/* Current categoriesAvailable */}
          <div className="flex flex-col gap-2">
            {categoriesAvailable &&
              categoriesAvailable.map((category: Category) =>
                editCategoryToggle == category.id ? (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 p-2"
                  >
                    <input
                      defaultValue={capitalize(category.name)}
                      className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      maxLength={20}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          sendEditForCategory(category.id, editedCategory!);
                          setEditCategoryToggle(null);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        sendEditForCategory(category.id, editedCategory!);
                        setEditCategoryToggle(null);
                      }}
                      aria-label={`Save ${category.name}`}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div
                    key={category.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 transition hover:bg-gray-900"
                  >
                    <p className="text-gray-200">{capitalize(category.name)}</p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditCategoryToggle(category.id)}
                        aria-label={`Edit ${category.name}`}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white active:scale-95"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCategory.mutateAsync(category)}
                        aria-label={`Delete ${category.name}`}
                        className="rounded-lg px-2 py-1 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-300 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ),
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
