"use client";
import ClothingItemCard from "@/components/ClothingItemCard";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import ItemDetail from "@/components/ItemDetail";
import Logout from "@/components/Logout";
import { CirclePlus, Settings, LogOut, X } from "lucide-react";
import ItemForm from "@/components/ItemForm";
import { useClothingItems } from "@/functions/clothingItems";
import capitalize from "@/functions/capitalize";
import OurSettings from "@/components/OurSettings";

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState<string>("");
  const [logout, setLogout] = useState(false);
  const [toggleSettings, setToggleSettings] = useState<boolean>(false);

  const { getAllItems, getCategories } = useClothingItems({
    search: searchParam,
    category: categoryFilter === "All" ? "" : categoryFilter,
  });

  const clothingItems = getAllItems.data ?? [];
  const categoriesAvailable = getCategories.data
    ? [{ id: 0, name: "All" }, ...getCategories.data]
    : [{ id: 0, name: "All" }];

  useEffect(() => {
    if (!toggleSettings) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToggleSettings(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSettings]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
      <div
        className={`transition-all duration-300 ease-in-out ${
          toggleSettings ? "opacity-50" : "opacity-100"
        }`}
        onClick={() =>
          toggleSettings ? setToggleSettings(false) : setToggleSettings(true)
        }
      >
        <div className="flex flex-col">
          <header className="border-b border-gray-800 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <Link href="/gallery">
                <Image
                  src="/wardrobe.svg"
                  alt="Wardrobe logo"
                  width={80}
                  height={20}
                  priority
                  className="rounded-xl"
                />
              </Link>
              <div className="flex flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleSettings
                      ? setToggleSettings(false)
                      : setToggleSettings(true);
                  }}
                  className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                >
                  <Settings size={20} />
                </button>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                  onClick={() => setLogout(true)}
                >
                  <LogOut size={20} />
                </button>
                {logout && <Logout></Logout>}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <ul className="flex flex-wrap gap-2">
                {categoriesAvailable &&
                  categoriesAvailable.map(
                    (category: { id: number; name: string }) => (
                      <li
                        key={category.id}
                        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-light transition ${
                          categoryFilter === category.name
                            ? "border-indigo-500 bg-indigo-500 text-white"
                            : "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
                        }`}
                        onClick={() => {
                          setCategoryFilter(category.name);
                          if (category.name == "All" && searchParam) {
                            setSearchParam("");
                          }
                        }}
                      >
                        {capitalize(category.name)}
                      </li>
                    ),
                  )}
              </ul>

              <input
                id="search"
                value={searchParam}
                placeholder="Search: Name, Description or Tags"
                onChange={(e) => {
                  setSearchParam(e.target.value);
                }}
                className="w-full rounded-full border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:w-[30vw] lg:focus:w-[50vw]"
              />
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6">
            <div className="relative flex flex-col">
              <p className="px-1 pt-6 text-sm text-gray-400">
                {clothingItems.length} items
              </p>
              <div className="my-6 flex flex-wrap items-start gap-6">
                {clothingItems.map((item: ClothingItem) => (
                  <ClothingItemCard
                    key={item.id}
                    item={item}
                    onItemSelect={(item: ClothingItem) => {
                      setSelectedItem(item);
                      setDetailModalOpen(true);
                    }}
                    onEditSelect={(item: ClothingItem) => {
                      setSelectedItem(item);
                      setEditModalOpen(true);
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Add item"
                onClick={() => setAddItemModalOpen(true)}
                className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition duration-150 ease-in-out hover:scale-110 hover:bg-indigo-500 active:scale-100"
              >
                <CirclePlus size={28} aria-hidden="true" />
              </button>
            </div>

            {detailModalOpen && selectedItem && (
              <ItemDetail
                item={selectedItem}
                onClose={() => {
                  setDetailModalOpen(false);
                }}
                onDelete={() => setDetailModalOpen(false)}
                onEdit={() => setEditModalOpen(true)}
              />
            )}
            {addItemModalOpen && (
              <ItemForm onClose={() => setAddItemModalOpen(false)} />
            )}
            {editModalOpen && (
              <ItemForm
                onClose={() => setEditModalOpen(false)}
                item={selectedItem}
              />
            )}
          </main>
        </div>
      </div>

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-64 max-w-full border-l border-gray-800 bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          toggleSettings
            ? "translate-x-0"
            : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!toggleSettings}
      >
        <button
          className="fixed right-2 top-2 hover:bg-red-800 rounded-md"
          onClick={() => setToggleSettings(false)}
        >
          <X size={20} />
        </button>
        <div className="h-full overflow-y-auto">
          <OurSettings />
        </div>
      </aside>
    </div>
  );
}
