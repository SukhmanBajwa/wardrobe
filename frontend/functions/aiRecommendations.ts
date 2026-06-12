import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";

// Hook

const useAiRecommendations = (id: number) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const previousDataRef = useRef<AiRecommendation[] | null>(null);
  const queryClient = useQueryClient();

  const getAiRecommendation = useQuery({
    queryKey: ["aiRecom", id],
    queryFn: async () => {
      const data = await fetchAiRecommendations(id);
      if (isRefreshing && previousDataRef.current !== null) {
        // check if data actually changed
        if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
          setIsRefreshing(false);
        }
      }
      previousDataRef.current = data;
      return data;
    },
    refetchInterval: isRefreshing ? 2000 : false,
  });

  const triggerRefresh = async () => {
    previousDataRef.current = getAiRecommendation.data ?? null;
    await refreshAiRecommendations(id);
    setIsRefreshing(true);
  };
  return {
    getAiRecommendation,
    triggerRefresh,
    isRefreshing,
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

const refreshAiRecommendations = async (id: number) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/v1/ai/ai_req_refresh/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) {
    alert(`Failed to fetch recommendations: ${JSON.stringify(res.json())}`);
  }
  return res;
};
