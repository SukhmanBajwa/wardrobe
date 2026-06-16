"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import capitalize from "@/functions/capitalize";

export default function ClothingItemCard({
  item,
  onItemSelect,
  onEditSelect,
}: ClothingItemCardProps) {
  const { name, image_url, tags, description, category } = item;
  return (
    <div className="relative sm:w-full md:w-59">
      <div className="absolute top-2 right-2 z-10 mix-blend-difference text-white cursor-pointer rounded-2xl hover:bg-green-900 p-1 border-0 hover:border hover:scale-110 transition ease-in-out duration-300">
        <Pencil size={20} onClick={() => onEditSelect(item)} />
      </div>
      <div
        className="bg-gray-800/60 rounded-2xl shadow-2xl  border border-gray-700/50 border-t-2 cursor-pointer hover:shadow-blue-100 hover:shadow-sm hover:border-gray-500/50 active:shadow-green-100 active:shadow-sm active:border-gray-500/50 transition duration-300 ease-in-out"
        onClick={() => {
          onItemSelect(item);
        }}
      >
        <div className="border-b bg-graw-900 border-gray-700/50">
          <Image
            src={image_url || "https://picsum.photos/id/237/500/700"}
            alt={name}
            width={100}
            height={100}
            className="h-75 w-59 object-cover rounded-lg  bg-gray-900/100"
          />{" "}
          {tags.length > 0 ? (
            tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-block text-gray-400 text-xs font-light p-1"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="inline-block text-gray-400 text-xs font-light p-1">
              #N/A
            </span>
          )}
        </div>
        <div className="flex flex-col justify-between items-start px-2.5 py-3 gap-y-1">
          <h2 className="pt-1 text-sm">{capitalize(name)}</h2>
          {!!category && (
            <p className="border px-2 py-0.5 rounded-2xl w-fit bg-indigo-600/50 border-gray-500 text-indigo-200 text-xs font-light">
              {capitalize(category)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
