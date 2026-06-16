"use client";
import { X, Plus, Trash2, CheckIcon, ChevronDownIcon } from "lucide-react";
import { useClothingItems } from "@/functions/clothingItems";
import { useEffect, useState } from "react";
import capitalize from "@/functions/capitalize";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-700/60 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-100">
            {item ? "Edit item" : "Add new item"}
          </h1>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                buildFormData();
                onClose();
              }}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95"
            >
              Save Item
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
          {/* Left: Image Upload */}
          <div className="flex w-full shrink-0 flex-col items-center gap-2 md:w-72">
            <label
              htmlFor="image-upload"
              className="relative flex h-72 w-56 flex-shrink-0 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-gray-900 text-gray-400 transition-colors hover:border-indigo-500 hover:text-indigo-400"
            >
              {imgPreview && (
                <img
                  src={imgPreview}
                  className="absolute inset-0 h-full w-full object-cover"
                  alt="preview"
                />
              )}
              <Plus size={24} className="relative z-10" />
              <span className="relative z-10 text-sm">
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

            {tags && tags.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex min-w-0 items-center gap-1 overflow-hidden rounded-full border border-gray-600 px-2 py-1 text-xs font-light text-gray-400"
                  >
                    <Trash2
                      size={14}
                      className="shrink-0 cursor-pointer hover:text-red-500"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                    />
                    <span className="truncate">#{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Fields */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Name + Category row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1 ">
                <label className="text-sm text-gray-300">Name</label>
                <input
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                  defaultValue={name}
                  maxLength={30}
                  className="h-12 rounded-lg border border-gray-700 bg-gray-900 px-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Listbox
                  name="category"
                  onChange={setCategoryName}
                  value={categoryName}
                >
                  <Label className="text-sm text-gray-300">Category</Label>
                  <ListboxButton className="flex h-12 w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-900 px-4 text-left text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <span>
                      {categoryName
                        ? capitalize(categoryName)
                        : "Select category"}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 text-gray-400"
                    />
                  </ListboxButton>
                  <ListboxOptions
                    anchor="bottom start"
                    className="mt-1 w-[var(--button-width)] z-50 rounded-lg border border-gray-700 bg-gray-900 py-1 shadow-lg focus:outline-none"
                  >
                    {categoriesAvailable &&
                      categoriesAvailable.map((category: Category) => (
                        <ListboxOption
                          key={category.id}
                          value={category.name}
                          className="group relative cursor-default py-2 pr-9 pl-3 text-white select-none data-focus:bg-indigo-500 data-focus:outline-hidden"
                        >
                          <span className="block truncate">
                            {capitalize(category.name)}
                          </span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-400 group-not-data-selected:hidden group-data-focus:text-white">
                            <CheckIcon aria-hidden="true" className="size-5" />
                          </span>
                        </ListboxOption>
                      ))}
                  </ListboxOptions>
                </Listbox>
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
                className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
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
                className="resize-none rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
