"use client";
import Image from "next/image";
import { X, Plus, ImageIcon } from "lucide-react";
import { addItem } from "@/functions/addItem";
import { useEffect, useState } from "react";

export default function AddClothingItem({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImage_url] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [categoriesAvailable, setCategoriesAvailable] = useState<
    { id: number; name: string }[]
  >([]);
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const addNewClothingItem: () => void = async () => {
    if (!category) {
      alert("Please select a category");
      return;
    }
    console.log(category);
    await addItem(name, category, description, image_url);
  };

  useEffect(() => {
    const fetchCategories: () => void = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/v1/categories/`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const data = await response.json();
        setCategoriesAvailable(data);
      } else {
        const errorResponse = await response.json();
        alert(`Failed to fectch categories: ${errorResponse.error}`);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className=" modal-container bg-black/50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 rounded-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="modal-header flex justify-between">
          <div className="flex justify-evenly gap-9">
            <h1 className="text-2xl font-bold text-gray-200">Add new item</h1>
            <button className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1">
              Cancel
            </button>
          </div>

          <div className="flex justify-evenly gap-4">
            <button
              className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1"
              onClick={addNewClothingItem}
            >
              Save Item
            </button>
            <X
              size="40"
              className="cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1"
              onClick={onClose}
            />
          </div>
        </div>
        <hr className="border-gray-600 "></hr>
        <div className="flex gap-6 p-4">
          {/* Left: Image Upload */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <label
              htmlFor="image-upload"
              className="w-48 h-56 flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-900 border-2 border-dashed border-gray-600 text-gray-400 cursor-pointer hover:border-indigo-500 hover:text-indigo-400 transition-colors"
            >
              <Plus size={24} />
              <span className="text-sm">Upload photo</span>
            </label>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
            />
            <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {/* Name + Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">Name</label>
                <textarea
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                  rows={1}
                  className=" resize-none px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">Category</label>
                <select
                  name="category"
                  defaultValue={"Select"}
                  onChange={(e) => setCategory(Number(e.target.value))}
                  className="h-12.5 px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Select" disabled>
                    Select category
                  </option>
                  {categoriesAvailable &&
                    categoriesAvailable.map((category) => (
                      <option key={category.id} value={category.id}>
                        {capitalize(category.name)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">Description</label>
              <textarea
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={4}
                className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
