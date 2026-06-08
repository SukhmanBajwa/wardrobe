import "./ItemDetail.css";
import Image from "next/image";
import { X } from "lucide-react";
import { useClothingItems } from "@/functions/clothingItems";
import { useAiRecommendations } from "@/functions/aiRecommendations";

export default function ItemDetail({
  item,
  onClose,
  onDelete,
  onEdit,
}: {
  item: ClothingItem;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const { deleteClothingItem } = useClothingItems({});
  const { getAiRecommendation } = useAiRecommendations(item.id);
  const aiRecommendation = getAiRecommendation.data;
  return (
    <div className=" modal-container bg-black/50 absolute z-20">
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 rounded-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="modal-header flex justify-between">
          <div className="">
            <h1 className="text-2xl font-bold text-gray-200">Item details</h1>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1"
              onClick={() => {
                onEdit();
                onClose();
              }}
            >
              Edit
            </button>
            <button className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1">
              Share
            </button>
            <button
              className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1"
              onClick={async () => {
                await deleteClothingItem.mutateAsync(item.id);
                onDelete();
                onClose();
              }}
            >
              Delete
            </button>
            <X
              size="40"
              className="cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1"
              onClick={onClose}
            />
          </div>
        </div>
        <hr className="border-gray-600 "></hr>
        <div className="modal-body flex flex-row p-3">
          <div className="item w-1/2">
            <Image
              src={item.image_url || "https://picsum.photos/id/237/500/700"}
              alt={item.name}
              width={250}
              height={250}
              className="rounded-lg object-cover w-64 h-64"
              priority
            />
            <div className="flex flex-col gap-1 mt-3 text-1xl items-baseline">
              <h2 className=" font-bold">{item.name}</h2>
              <div className="flex flew-row gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block font-light text-sm text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className=" bg-indigo-600 text-white text-xs font-light px-2 py-1 mt-1 rounded-full mr-2 mb-2 w-auto">
                {capitalize(item.category)}
              </p>

              <hr className="border-gray-600 w-70 my-1"></hr>
              <p className="text-gray-400">{capitalize(item.description)}</p>
            </div>
          </div>
          <div className="recommendations w-1/2">
            <h2 className="text-white font-bold mb-2">Pairs well with</h2>
            {aiRecommendation &&
              aiRecommendation.map((rec: AiRecommendation, index: number) => (
                <div
                  key={index}
                  className="recommendation-card flex flex-row gap-3"
                >
                  <Image
                    src={
                      rec.recommended_item.image ||
                      "https://picsum.photos/id/237/500/700"
                    }
                    alt={rec.recommended_item.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover flex-shrink-0 w-20 h-20"
                    priority
                  />
                  <div className="col-span-3">
                    <h3 className="text-white text-sm font-medium">
                      {rec.recommended_item.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{rec.reason}</p>
                  </div>
                  <hr className="m-2 border-gray-600 "></hr>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
