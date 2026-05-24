"use client";
import ClothingItemCard from "@/components/ClothingItemCard";
import ClothingItem from "./types/clothing";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ItemDetail from "@/components/ItemDetail";
import Logout from "@/components/Logout";

export default function Gallery() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [logout, setLogout] = useState(false);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const router = useRouter();

  useEffect(() => {
    const fetchClothingItems = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
        { method: "GET", credentials: "include" },
      );
      if (res.ok) {
        const clothingData = await res.json();
        console.log("Clothing items:", clothingData);
        setClothingItems(clothingData);
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
    fetchClothingItems();
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
        <ul>
          {categories.map((category) => (
            <li
              key={category}
              className="inline-block text-white text-xs font-light border border-gray-500 px-3 py-1 rounded-full mr-2 mb-2"
            >
              {capitalize(category)}
            </li>
          ))}
        </ul>
      </header>
      {detailModalOpen && selectedItem && <ItemDetail item={selectedItem} />}
      <main>
        <p className="px-3">{clothingItems.length} items</p>
        <div className="flex items-start justify-normal px-4 gap-6 my-6">
          {clothingItems.map((item) => (
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
      </main>
    </div>
  );
}
