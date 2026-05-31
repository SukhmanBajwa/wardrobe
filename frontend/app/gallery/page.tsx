"use client";
import ClothingItemCard from "@/components/ClothingItemCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ItemDetail from "@/components/ItemDetail";
import Logout from "@/components/Logout";
import { CirclePlus } from "lucide-react";
import AddClothingItem from "@/components/AddClothingItem";
import { fetchClothingItems } from "@/functions/getClothingItem";

export default function Gallery() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState<string>("");
  const [logout, setLogout] = useState(false);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const res: Response = await fetchClothingItems();
      if (res.ok) {
        const clothingData = await res.json();
        console.log("Clothing items:", await clothingData);
        setClothingItems(await clothingData);
        const categories: string[] = [
          "All",
          ...new Set<string>(
            clothingData.map((item: ClothingItem) => item.category),
          ),
        ];
        setCategories(categories);
        console.log("Categories:", categories);
      } else if (res.status == 401) {
        router.push("/login");
      } else {
        const data = await res.json();
        console.error(
          `Failed to fetch clothing items: ${JSON.stringify(data)}`,
        );
      }
    };
    fetchItems();
  }, []);

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
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Name</label>
          <textarea
            name="name"
            onChange={(e) => setSearchParam(e.target.value)}
            placeholder="Item name"
            rows={1}
            className=" resize-none px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <ul>
          {categories.map((category) => (
            <li
              key={category}
              className="inline-block cursor-pointer text-white text-xs font-light border border-gray-500 px-3 py-1 rounded-full mr-2 mb-2  active:bg-indigo-500 focus:bg-indigo-500"
              onClick={() => setCategoryFilter(category)}
            >
              {capitalize(category)}
            </li>
          ))}
        </ul>
      </header>

      <main>
        <div className="flex flex-col">
          <p className="px-3">{clothingItems.length} items</p>
          <div className="flex items-start justify-normal flex-wrap px-4 gap-6 my-6">
            {clothingItems
              .filter(
                (item) =>
                  categoryFilter === "All" || item.category === categoryFilter,
              )
              .filter(
                (item) =>
                  searchParam === "" ||
                  item.name.toLowerCase().includes(searchParam.toLowerCase()) ||
                  item.description
                    ?.toLowerCase()
                    .includes(searchParam.toLowerCase()) ||
                  item.tags.some((tag) =>
                    tag.toLowerCase().includes(searchParam),
                  ),
              )
              .map((item) => (
                <ClothingItemCard
                  key={item.id}
                  item={item}
                  onItemSelect={(item: ClothingItem) => {
                    setSelectedItem(item);
                    setDetailModalOpen(true);
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
            onClose={() => setDetailModalOpen(false)}
          />
        )}
        {addItemModalOpen && (
          <AddClothingItem onClose={() => setAddItemModalOpen(false)} />
        )}
      </main>
    </div>
  );
}
