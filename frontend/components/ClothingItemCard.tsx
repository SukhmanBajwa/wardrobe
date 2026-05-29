"use client";

import Image from "next/image";
import ClothingItem from "./types/clothing";

interface ClothingItemCardProps {
  item: ClothingItem;
  onItemSelect: (item: ClothingItem) => void;
}
export default function ClothingItemCard({
  item,
  onItemSelect,
}: ClothingItemCardProps) {
  const { name, image_url, tags, description, category } = item;
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <div
      className="bg-gray-800/60 rounded-2xl shadow-2xl  border border-gray-700/50 border-t-2 cursor-pointer hover:shadow-blue-100 hover:shadow-sm hover:border-gray-500/50 active:shadow-green-100 active:shadow-sm active:border-gray-500/50 transition duration-300 ease-in-out"
      onClick={() => {
        onItemSelect(item);
        console.log("Selected item:", item);
      }}
    >
      <div className="border-b bg-graw-900 border-gray-700/50">
        <Image
          src={image_url}
          alt={name}
          width={100}
          height={100}
          className="h-75 w-59 object-cover rounded-lg  bg-gray-900/100"
        />
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="inline-block text-gray-400 text-xs font-light p-1"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex flex-col justify-between items-start px-2.5 py-3 gap-y-1">
        <h2 className="pt-1 text-sm">{name}</h2>
        {!!category && (
          <p className="border px-2 py-0.5 rounded-2xl w-fit bg-indigo-600/50 border-gray-500 text-indigo-200 text-xs font-light">
            {capitalize(category)}
          </p>
        )}
      </div>
    </div>
  );
}
