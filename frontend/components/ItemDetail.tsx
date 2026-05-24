import "./ItemDetail.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ItemDetail({ item }: { item: ClothingItem }) {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const [aiRecommendations, setAiRecommendations] = useState();

  useEffect(() => {
    const fetchAiRecommendations = async (id: number) => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/v1/ai/ai_rec/${id}`,
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
      <div className="modal">
        <div className="modal-header">
          <h1 className="text-2xl font-bold text-gray-200">{item.name}</h1>
        </div>
        <div className="modal-body">
          <div className="side-bar">
            <Image
              src={item.image_url}
              alt={item.name}
              width={250}
              height={50}
              className="rounded-lg"
              priority
            />
            <p className="text-gray-400">
              This is where the item details will be displayed.
            </p>
            <p className="text-gray-400">
              Category: {capitalize(item.category)}
            </p>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-indigo-600 text-white text-xs font-light px-2 py-1 rounded-full mr-2 mb-2"
              >
                {capitalize(tag)}
              </span>
            ))}
            <p className="text-gray-400">Ai Description.......... </p>
          </div>
          <div className="main-content">
            <h2 className="text-white">Pairs well with</h2>
            {aiRecommendations.map((rec: AiRecommendation, index: number) => (
              <div key={index} className="recommendation-card">
                <Image
                  src={rec.recommended_item.image_url}
                  alt={rec.recommended_item.name}
                  width={250}
                  height={50}
                  className="rounded-lg"
                  priority
                />
                <h3 className="text-white">{rec.recommended_item.name}</h3>
                <p className="text-gray-400">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
