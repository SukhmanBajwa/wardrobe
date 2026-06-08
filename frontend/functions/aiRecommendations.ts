import { useQuery } from "@tanstack/react-query";

// Hook

const useAiRecommendations = (id: number) => {
  const getAiRecommendation = useQuery({
    queryKey: ["aiRecom", id],
    queryFn: async () => {
      return await fetchAiRecommendations(id);
    },
  });

  return {
    getAiRecommendation,
  };
};
export { useAiRecommendations };

const fetchAiRecommendations = async (id: number) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/v1/ai/ai_req/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (res.ok) {
    const data = await res.json();
    if (data.length === 0)
      throw new Error(`No recommendations found for ${id}`);
    return data;
  } else {
    const data = await res.json();
    alert(`Failed to fetch recommendations: ${JSON.stringify(data)}`);
  }
};
