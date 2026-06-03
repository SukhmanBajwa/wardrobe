"use client";
import ClothingItemCard from "@/components/ClothingItemCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ItemDetail from "@/components/ItemDetail";
import Logout from "@/components/Logout";
import { CirclePlus } from "lucide-react";
import ItemForm from "@/components/ItemForm";
import { fetchClothingItems } from "@/functions/clothingItems";
import { fetchCategories } from "@/functions/categories";

export default function Gallery() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState<string>("");
  const [logout, setLogout] = useState(false);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const router = useRouter();

  useEffect(() => {
    // Fetching items with search and filter parameters
    const fetchItems = async () => {
      const res: Response = await fetchClothingItems(
        searchParam || "",
        categoryFilter ? (categoryFilter == "All" ? "" : categoryFilter) : "",
      );
      if (res.ok) {
        setClothingItems(await res.json());

        // fetching all categories
        const categoryFetchResponse: Response = await fetchCategories();

        if (categoryFetchResponse.ok) {
          const categoriesArray: string[] = await categoryFetchResponse.json();
          setCategories([
            "All",
            ...new Set<string>(
              categoriesArray.map((category) => category["name"]),
            ),
          ]);
        } else {
          const data = await categoryFetchResponse.json();
          console.error(`Failed to fetch categories: ${JSON.stringify(data)}`);
        }
      } else if (res.status == 401) {
        router.push("/login");
      } else {
        const data = await res.json();
        console.error(
          `Failed to fetch clothing items: ${JSON.stringify(data)}`,
        );
      }
    };
    const timer = setTimeout(
      () => {
        fetchItems();
      },
      searchParam ? 300 : 0,
    );
    return () => clearTimeout(timer);
  }, [searchParam, categoryFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 px-4 gap-6">
      <header className="border-b rounded-2xl shadow-2xl p-4 border-gray-700 ">
        <div className="flex justify-between">
          <Link href="/gallery">
            <Image
              src="/wardrobe.svg"
              alt="Wardrobe logo"
              width={80}
              height={20}
              priority
              className="mx-start mb-3 rounded-xl"
            />
          </Link>

          <button className="cursor-pointer" onClick={() => setLogout(true)}>
            Logout
          </button>
          {logout && <Logout></Logout>}
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="pt-3">
            <ul>
              {categories.map((category) => (
                <li
                  key={category}
                  className="inline-block cursor-pointer text-white text-xs font-light border border-gray-500 px-3 py-1 rounded-full mr-2 mb-2  active:bg-indigo-500 focus:bg-indigo-500"
                  onClick={() => {
                    setCategoryFilter(category);
                    if (category == "All" && searchParam) {
                      setSearchParam("");
                    }
                  }}
                >
                  {capitalize(category)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <input
              id="search"
              value={searchParam}
              placeholder="Search: Name, Description or Tags"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-[30vw] focus:w-[50vw] hover:w-[50vw] transition-all duration-300 resize-none px-4 py-3 rounded-3xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </header>

      <main>
        <div className="flex flex-col relative">
          <p className="px-3">{clothingItems.length} items</p>
          <div className="flex items-start justify-normal flex-wrap px-4 gap-6 my-6">
            {clothingItems.map((item) => (
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
          <div className="fixed bottom-6 right-6 cursor-pointer w-12 h-12">
            <CirclePlus
              size="40"
              color="#ffffff"
              className="transition duration-150 ease-in-out hover:scale-110 hover:fill-violet-300/50 active:scale-100"
              onClick={() => setAddItemModalOpen(true)}
            />
          </div>
        </div>
        {detailModalOpen && selectedItem && (
          <ItemDetail
            item={selectedItem}
            onClose={() => {
              setDetailModalOpen(false);
            }}
            onDelete={() =>
              setClothingItems((prev) =>
                prev.filter((item) => item.id !== selectedItem.id),
              )
            }
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
  );
}
