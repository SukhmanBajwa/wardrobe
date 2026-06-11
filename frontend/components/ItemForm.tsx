"use client";
import { X, Plus, Trash2 } from "lucide-react";
import { useClothingItems } from "@/functions/clothingItems";
import { useEffect, useState } from "react";

export default function ItemForm({
  onClose,
  item,
}: {
  onClose: () => void;
  item?: ClothingItem | null;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [image, setImage] = useState((item?.image ?? null) || undefined);
  const [categoryName, setCategoryName] = useState(item?.category ?? "");
  const [tags, setTags] = useState<string[]>(item?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const formData = new FormData();

  const { editClothingItem, addClothingItem, getCategories } = useClothingItems(
    {
      item: item,
    },
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const categoriesAvailable = getCategories.data;

  const buildFormData: () => void = async () => {
    if (!categoryName) {
      alert("Please select a category");
      return;
    }
    if (!image) {
      alert("Please select a category");
      return;
    }

    if (name !== item?.name) formData.append("name", name);
    if (tags !== item?.tags) formData.append("new_tags", JSON.stringify(tags));
    if (description !== item?.description)
      formData.append("description", description);
    if (categoryName !== item?.category)
      formData.append("category_name", categoryName);
    if (image !== item?.image) formData.append("image", image as Blob);

    if (!item) {
      await addClothingItem.mutateAsync(formData);
    }
    if ([...formData.entries()].length === 0) return;
    if (item) {
      await editClothingItem.mutateAsync({ id: item.id, formData: formData });
    }
  };

  const imgPreview =
    image instanceof File ? URL.createObjectURL(image) : (image ?? null);
  return (
    <div className=" absolute modal-container bg-black/50 z-20">
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 rounded-xl p-6 w-full max-w-5xl min-h-auto max-h-screen overflow-y-auto ">
        <div className="modal-header flex justify-between">
          <div className="flex justify-evenly gap-9">
            <h1 className="text-2xl font-bold text-gray-200">
              {item ? "Edit item" : "Add new item"}
            </h1>
            <button className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1">
              Cancel
            </button>
          </div>

          <div className="flex justify-evenly gap-4">
            <button
              className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1"
              onClick={() => {
                buildFormData();
                onClose();
              }}
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
          <div className="flex flex-col items-center w-72 h-84 gap-2 shrink-0">
            <label
              htmlFor="image-upload"
              className="relative w-56 h-72 flex-shrink-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-900 border-2 border-dashed border-gray-600 text-gray-400 cursor-pointer hover:border-indigo-500 hover:text-indigo-400 transition-colors"
            >
              {imgPreview && (
                <img
                  src={imgPreview}
                  className="w-full h-full object-cover rounded-lg absolute inset-0"
                  alt="preview"
                />
              )}
              <Plus size={24} className="relative z-10" />
              <span className="text-sm relative z-10">
                {imgPreview ? "Change photo" : "Upload photo"}
              </span>
            </label>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files?.[0]);
              }}
            />
            <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {tags &&
                tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center border-2 min-w-0 rounded-2xl px-2 py-1 gap-1 text-xs font-light text-gray-400 overflow-hidden"
                  >
                    <Trash2
                      size={15}
                      className="hover:text-red-600 shrink-0"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                    />
                    <span className="truncate">#{tag}</span>
                  </span>
                ))}
            </div>
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
                  defaultValue={name}
                  rows={1}
                  maxLength={30}
                  className=" resize-none px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">Category</label>
                <select
                  name="category"
                  defaultValue={categoryName || "Select"}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="h-12.5 px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={item ? `${categoryName}` : "Select"} disabled>
                    {item ? `${capitalize(categoryName)}` : "Select"}
                  </option>
                  {categoriesAvailable &&
                    categoriesAvailable.map((category) => (
                      <option key={category.id} value={category.name}>
                        {capitalize(category.name)}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* Tags */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">Tags</label>
              <input
                name="tags"
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setTags([...tags, tagInput]);
                    setTagInput("");
                  }
                }}
                maxLength={10}
                placeholder="#Tags"
                value={tagInput ? tagInput : ""}
                className="h-12.5 px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              ></input>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">Description</label>
              <textarea
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                defaultValue={description}
                rows={4}
                maxLength={100}
                className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
