"use client";
import ClothingItemCard from "@/components/ClothingItemCard";
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import ItemDetail from "@/components/ItemDetail";
import {
  CirclePlus,
  Settings,
  LogOut as LogOutIcon,
  X,
  ChevronDownIcon,
  Funnel,
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
import Account from "@/components/Account";

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState<string>("");
  const { logoutMutation } = useAuth();
  const [toggleSettings, setToggleSettings] = useState<boolean>(false);
  const [settingsModal, setSettingsModal] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const placeholder: number[] = [1, 2, 3, 4, 5, 6];

  const { getAllItems, getCategories } = useClothingItems({
    search: searchParam,
    category: categoryFilter === "All" ? "" : categoryFilter,
  });

  const clothingItems: ClothingItem[] = (getAllItems.data ?? []).sort(
    (a: ClothingItem, b: ClothingItem) => a.name.localeCompare(b.name),
  );
  const categoriesAvailable: Category[] = getCategories.data
    ? [
        { id: 0, name: "All" },
        ...getCategories.data.sort((a: Category, b: Category) =>
          a.name.localeCompare(b.name),
        ),
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

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY >= 51) setScrolled(true);
      if (window.scrollY <= 50) setScrolled(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen  bg-linear-to-br from-gray-950 via-gray-900 to-indigo-950">
      <div
        className={`transition-all duration-300 ease-in-out ${
          settingsModal ? "opacity-50 pointer-events-auto" : "opacity-100"
        }`}
        onClick={() => toggleSettings && setToggleSettings(false)}
      >
        <div className="flex flex-col">
          <header
            className={`sticky top-0 z-40 transition-all duration-600 ${
              scrolled
                ? "scale-70 px-4 bg-transparent backdrop-blur-lg shadow-2xl/50 rounded-full"
                : "scale-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <Link href="/gallery">
                <Image
                  src="/wardrobe.svg"
                  alt="Wardrobe logo"
                  // size controlled by class below
                  width={0}
                  height={0}
                  priority
                  className={`rounded-xl transition-all duration-300 px-2 size-25 `}
                />
              </Link>
              <input
                id="search"
                value={searchParam}
                placeholder="Search: Name, Description or Tags"
                onChange={(e) => {
                  setSearchParam(e.target.value);
                }}
                className="w-full rounded-full border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:w-[30vw] lg:focus:w-[50vw]"
              />

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
                  onClick={() => logoutMutation.mutateAsync()}
                >
                  <LogOutIcon size={20} />
                </button>
              </div>
            </div>
          </header>

          <main className="reletive flex-1 px-4 sm:px-6">
            <div
              className={`sticky top-25 z-30 mt-5 rounded-full transition-all duration-300 w-fit}`}
            >
              {scrolled ? (
                <Listbox value={categoryFilter} onChange={setCategoryFilter}>
                  <ListboxButton
                    className={`flex items-center scale-110 gap-1 cursor-pointer rounded-full bg-gray-900/80 backdrop-blur-sm text-gray-300  px-3 py-1 text-xs hover:border-gray-400 ${scrolled ? "bg-gray-950/90 backdrop-blur-sm w-fit p-1" : "w-fit"}`}
                  >
                    <Funnel size={14} />
                    {capitalize(categoryFilter)}
                    <ChevronDownIcon className="size-3" />
                  </ListboxButton>
                  <ListboxOptions
                    anchor="bottom start"
                    transition
                    className="z-50 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg transition duration-200 ease-in-out data-closed:opacity-0 data-closed:scale-95 data-enter:scale-100 data-enter:opacity-100"
                  >
                    {categoriesAvailable.map((category) => (
                      <ListboxOption
                        key={category.id}
                        value={category.name}
                        className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer"
                      >
                        {capitalize(category.name)}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Listbox>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {getCategories.isSuccess &&
                    categoriesAvailable &&
                    categoriesAvailable.map(
                      (
                        category: { id: number; name: string },
                        index: number,
                      ) =>
                        index <= 6 ? (
                          <li
                            key={category.id}
                            className={`cursor-pointer rounded-full border-2 px-3 py-1 text-xs transition ${
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
                  {getCategories.isLoading &&
                    placeholder.map((each: number) => (
                      <div
                        className="animate-pulse h-7 w-16 rounded-full flex items-center justify-center  bg-gray-700"
                        key={each}
                      >
                        <div className="animate-pulse h-4 w-12 rounded-full  bg-gray-500" />
                      </div>
                    ))}
                  {getCategories.isSuccess &&
                    categoriesAvailable &&
                    categoriesAvailable.length > 7 && (
                      <li>
                        <Listbox
                          value={categoryFilter}
                          onChange={setCategoryFilter}
                        >
                          <ListboxButton className="flex items-center justify-evenly gap-1 cursor-pointer rounded-full border-2 border-gray-500 p`x-3 w-17 py-1 text-xs text-gray-300 hover:border-gray-400">
                            {categoryFilter &&
                              capitalize(
                                (categoriesAvailable
                                  .slice(7)
                                  .find((cat) => cat.name === categoryFilter)
                                  ?.name ?? "More") as string,
                              )}
                            <ChevronDownIcon
                              className="group pointer-events-none shrink-0 size-3 fill-white/60"
                              aria-hidden="true"
                            />
                          </ListboxButton>
                          <ListboxOptions
                            anchor="bottom start"
                            transition
                            className="absolute z-10 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg transition duration-200 ease-in-out data-closed:opacity-0 data-closed:scale-95 data-enter:scale-100 data-enter:opacity-100"
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
                    )}
                </ul>
              )}
            </div>
            <div className=" flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"></div>
            <div className="relative flex flex-col">
              <p className="px-1 pt-6 text-sm text-gray-400">
                {clothingItems.length} items
              </p>
              <div className="my-6 flex flex-wrap items-center pl-5 gap-6">
                {!getAllItems.isLoading && clothingItems
                  ? clothingItems.map((item: ClothingItem) => (
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
                    ))
                  : placeholder.map((each: number) => (
                      <div className="relative sm:w-screen md:w-59" key={each}>
                        <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 border-t-2">
                          <div className="h-75 w-59 bg-gray-700 rounded-lg animate-pulse" />
                          <div className="px-2.5 py-3 flex flex-col gap-2">
                            <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse" />
                          </div>
                        </div>
                      </div>
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
            {clothingItems.length === 0 && (
              <p>
                Add new item to start. Click on add(+) icon from the bottom.
              </p>
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
      {settingsModal === "account" && (
        <Account onClose={() => setSettingsModal(null)} />
      )}
    </div>
  );
}
