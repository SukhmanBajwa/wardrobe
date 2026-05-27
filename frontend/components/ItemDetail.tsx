import "./ItemDetail.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ItemDetail({
  item,
  onClose,
}: {
  item: ClothingItem;
  onClose: () => void;
}) {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const [aiRecommendations, setAiRecommendations] = useState();

  useEffect(() => {
    const fetchAiRecommendations = async (id: number) => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/v1/ai/ai_req/${id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (res.ok) {
        setAiRecommendations(await res.json());
        console.log(aiRecommendations);
      } else {
        const data = await res.json();
        console.error(
          `Failed to fetch recommendations: ${JSON.stringify(data)}`,
        );
      }
    };
    fetchAiRecommendations(item.id);
  }, []);

  return (
    <div className=" modal-container bg-black/50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 rounded-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="modal-header flex justify-between">
          <div className="">
            <h1 className="text-2xl font-bold text-gray-200">Item details</h1>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1">
              Edit
            </button>
            <button className="col-span-1 cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1">
              Share
            </button>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={onClose}
              className="cursor-pointer hover:bg-gray-200/5 active:bg-gray-500/5 p-1"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                  fill="#ffffff"
                ></path>{" "}
              </g>
            </svg>
          </div>
        </div>
        <hr className="border-gray-600 "></hr>
        <div className="modal-body flex flex-row p-3">
          <div className="item w-1/2">
            <Image
              src={item.image_url}
              alt={item.name}
              width={250}
              height={250}
              className="rounded-lg object-cover w-64 h-64"
              priority
            />
            <h2 className=" font-bold">{item.name}</h2>
            <p className="text-gray-400">{capitalize(item.category)}</p>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-indigo-600 text-white text-xs font-light px-2 py-1 rounded-full mr-2 mb-2"
              >
                {capitalize(tag)}
              </span>
            ))}
            <hr className="border-gray-600 "></hr>
            <p className="text-gray-400">{capitalize(item.description)}</p>
          </div>
          <div className="recommendations w-1/2">
            <h2 className="text-white font-bold mb-2">Pairs well with</h2>
            {aiRecommendations &&
              aiRecommendations.map((rec: AiRecommendation, index: number) => (
                <div
                  key={index}
                  className="recommendation-card flex flex-row gap-3"
                >
                  <Image
                    src={rec.recommended_item.image_url}
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
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
