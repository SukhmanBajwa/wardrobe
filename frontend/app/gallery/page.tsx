"use client";
import ClothingItemCard from "@/components/clothing_item_card";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [clothingItems, setClothingItems] = useState([]);

  useEffect(() => {
    const fetchClothingItems = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
        { method: "GET", credentials: "include" },
      );
      if (res.ok) {
        const clothing_data = await res.json();
        console.log("Clothing items:", clothing_data);
        setClothingItems(clothing_data);
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
    <div>
      <main>
        <h1>Gallery</h1>
        {clothingItems.map((item) => (
          <ClothingItemCard key={item.id} item={item} />
        ))}
      </main>
    </div>
  );
}
