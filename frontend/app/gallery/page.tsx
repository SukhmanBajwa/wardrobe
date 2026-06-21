"use client";
import ClothingItemCard from "@/components/ClothingItemCard";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import ItemDetail from "@/components/ItemDetail";
import {
  CirclePlus,
  Settings,
  LogOut as LogOutIcon,
  X,
  ChevronDownIcon,
} from "lucide-react";
import ItemForm from "@/components/ItemForm";
import { useClothingItems } from "@/functions/clothingItems";
import capitalize from "@/functions/capitalize";
import OurSettings from "@/components/OurSettings";
import Categories from "@/components/Categories";
import Tags from "@/components/Tags";
import { useAuth } from "@/functions/auth";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState<string>("");
  const { Logout } = useAuth();
  const [toggleSettings, setToggleSettings] = useState<boolean>(false);
  const [settingsModal, setSettingsModal] = useState<string | null>(null);

  const { getAllItems, getCategories } = useClothingItems({
    search: searchParam,
    category: categoryFilter === "All" ? "" : categoryFilter,
  });

  const clothingItems: ClothingItem[] = (getAllItems.data ?? []).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const categoriesAvailable: Category[] = getCategories.data
    ? [
        { id: 0, name: "All" },
        ...getCategories.data.sort((a, b) => a.name.localeCompare(b.name)),
      ]
    : [{ id: 0, name: "All" }];

  const onSettingMenuSelect = (modal: string) => {
    setSettingsModal(modal);
  };

  useEffect(() => {
    if (!settingsModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSettingsModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsModal]);

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-linear-to-br from-gray-950 via-gray-900 to-indigo-950">
      <div
        className={`transition-all duration-300 ease-in-out ${
          settingsModal ? "opacity-50 pointer-events-auto" : "opacity-100"
        }`}
        onClick={() => toggleSettings && setToggleSettings(false)}
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
                    setToggleSettings(toggleSettings ? false : true);
                  }}
                  className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                >
                  <Settings size={20} />
                </button>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                  onClick={() => Logout()}
                >
                  <LogOutIcon size={20} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <ul className="flex flex-wrap gap-2">
                {categoriesAvailable &&
                  categoriesAvailable.map(
                    (category: { id: number; name: string }, index: number) =>
                      index <= 6 ? (
                        <li
                          key={category.id}
                          className={`cursor-pointer rounded-full border-2 px-3 py-1 text-xs    transition ${
                            categoryFilter === category.name
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-gray-500  hover:border-gray-400 hover:text-white"
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
                      ) : null,
                  )}
                <li>
                  <Listbox value={categoryFilter} onChange={setCategoryFilter}>
                    <ListboxButton className="flex items-center justify-evenly gap-1 cursor-pointer rounded-full border-2 border-gray-500 p`x-3 w-17 py-1 text-xs text-gray-300 hover:border-gray-400">
                      {categoryFilter &&
                        capitalize(
                          (categoriesAvailable
                            .slice(7)
                            .find((cat) => cat.name === categoryFilter)?.name ??
                            "More") as string,
                        )}
                      <ChevronDownIcon
                        className="group pointer-events-none shrink-0 size-3 fill-white/60"
                        aria-hidden="true"
                      />
                    </ListboxButton>
                    <ListboxOptions
                      anchor="bottom start"
                      className="absolute z-10 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
                    >
                      {categoriesAvailable &&
                        categoriesAvailable
                          .slice(7)
                          .map(
                            (
                              category: { id: number; name: string },
                              index: number,
                            ) => (
                              <ListboxOption
                                className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer"
                                key={category.id}
                                value={category.name}
                              >
                                {capitalize(category.name)}
                              </ListboxOption>
                            ),
                          )}
                    </ListboxOptions>
                  </Listbox>
                </li>
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
              <div className="my-6 flex flex-wrap items-center pl-5 gap-6">
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
          toggleSettings === true
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
          <OurSettings modal={onSettingMenuSelect} />
        </div>
      </aside>
      {settingsModal === "categories" && (
        <Categories onClose={() => setSettingsModal(null)} />
      )}
      {settingsModal === "tags" && (
        <Tags onClose={() => setSettingsModal(null)} />
      )}
    </div>
  );
}
