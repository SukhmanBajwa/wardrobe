import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SearchCheck } from "lucide-react";

const useClothingItems = (item: ClothingItem | undefined) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient();

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: ["allItems"] });
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const getItem = useQuery({
    queryKey: ["oneItem", item?.id],
    queryFn: async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/v1/clothing_items/${item?.id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch item");
      return res.json();
    },
    enabled: item !== null,
  });
  return {
    getItem,
  };
};
export { useClothingItems };

export async function addClothingItem(formData: FormData) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );
  return response;
}

export async function fetchClothingItems(
  search: string = "",
  category: string = "",
) {
  const categoryParam = category ? `?category=${category}` : "";
  const searchParam = search
    ? category
      ? `&search=${search}`
      : `?search=${search}`
    : "";
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/v1/clothing_items/" +
        categoryParam +
        searchParam,
      {
        method: "GET",
        credentials: "include",
      },
    );
    return res;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

export async function editClothingItem(id: number, formData: FormData) {
  try {
    let bodyData: FormData | Record<string, string> = {};
    if (formData.has("image")) {
      bodyData = formData;
    } else {
      for (let [key, value] of formData.entries()) {
        // "bodyData as" | "value as" means trust me bro they are this type for now. Just to make compiler to stop complaining.
        (bodyData as Record<string, string>)[key] = value as string;
      }
    }
    console.log("has image:", formData.has("image"));
    console.log("formData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log("bodyData:", bodyData);
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/v1/clothing_items/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: formData.has("image")
          ? undefined
          : { "Content-Type": "application/json" },
        body: formData.has("image")
          ? (bodyData as FormData)
          : JSON.stringify(bodyData),
      },
    );
    console.log("status:", res.status);
    console.log("response:", await res.json());
    if (!res.ok) {
      throw new Error("HTTP error! Status: ${res.status}");
    }
    return true;
  } catch (error) {
    console.error("Error editing item:", error);
  }
}

// Soft delete — sends DELETE request, backend sets is_deleted=True instead of removing the record
export async function deleteClothingItem(id: number) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/v1/clothing_items/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error("HTTP error! Status: ${res.status}");
    }
    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

// fetch available categories.
export async function fetchAvailableCategories() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (response.ok) {
    return await response.json();
  } else {
    const errorResponse = await response.json();
    alert(`Failed to fectch categories: ${errorResponse.error}`);
  }
}
