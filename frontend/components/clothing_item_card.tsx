"use client";

import Image from "next/image";
interface ClothingItem {
  id: number;
  name: string;
  description: string;
  image_url: string;
  //   tags: string[];
  category: string;
}

interface ClothingItemCardProps {
  item: ClothingItem;
}
export default function ClothingItemCard({ item }: ClothingItemCardProps) {
  const { name, image_url, description, category } = item;
  return (
    <div className="h-95 w-75 bg-gray-800/60 rounded-2xl shadow-2xl p-8 border border-gray-700/50 border-t-2">
      <h2 className="py-2 font-bold">{name}</h2>
      <Image
        src={image_url}
        alt={name}
        width={400}
        height={300}
        className="h-55 w-55 object-cover rounded-lg mb-4 bg-gray-900/100"
      />
      {/* {tags.map((tag) => (
        <span
          key={tag}
          className="inline-block bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full mr-2 mb-2"
        >
          {tag}
        </span>
      ))} */}
      <p>Category: {category}</p>
      <p className="truncate ">Description: {description}</p>
    </div>
  );
}
