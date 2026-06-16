import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./fetchWithAuth";

// Hook

const useClothingItems = ({
  item,
  id,
  search,
  category,
}: {
  item?: ClothingItem | null | undefined;
  id?: number | null | undefined;
  search?: string | null | undefined;
  category?: string | null | undefined;
}) => {
  const queryClient = useQueryClient();

  // Invlidation
  const invalidateClothingItem_s = (id: number | null | undefined) => {
    queryClient.invalidateQueries({
      queryKey: ["clothingItems"],
    });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["clothingItem", item?.id] });
    }
  };

  // Get
  const getItem = useQuery({
    queryKey: ["clothingItem", id],
    queryFn: async () => {
      return await getClothingItem(id!);
    },
    enabled: !!id,
  });

  const getAllItems = useQuery({
    queryKey: ["clothingItems", search, category],
    queryFn: async () => {
      return await getClothingItems(search, category);
    },
  });

  // Add
  const addClothingItem = useMutation({
    mutationFn: async (formData: FormData) => {
      await addClothingItemFn(formData!);
    },
    onSettled: () => {
      invalidateClothingItem_s(null);
    },
  });

  // Edit
  const editClothingItem = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: FormData;
    }) => {
      await editClothingItemFn(id, formData);
    },
    onSuccess: (_, variables) => {
      invalidateClothingItem_s(variables.id);
    },
  });

  //Soft Delete
  const deleteClothingItem = useMutation({
    mutationFn: async (id: number) => {
      return await deleteClothingItemFn(id);
    },
    onMutate: async (deletedItem) => {
      await queryClient.cancelQueries({ queryKey: ["clothingItems"] });

      const previousItems = queryClient.getQueryData(["clothingItems"]);
      // old is the entire list of items
      queryClient.setQueryData(["clothingItems"], (old: ClothingItem[]) => {
        if (!old) return old;
        return old.filter((item) => item.id !== deletedItem.id);
      });

      return { previousItems };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["clothingItems"], context?.previousItems);
    },
    onSettled: (data, error, variables) => {
      invalidateClothingItem_s(null);
    },
  });

  // Get categories
  const getCategories = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      return await fetchAvailableCategoriesFn();
    },
  });

  // Add category
  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      return await addNewCategoryFn(name);
    },

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["allCategories"] }),
  });

  // Edit category
  const editCategory = useMutation({
    mutationFn: async (category: Category) => {
      return await editAvailableCategoryFn(category);
    },
    onMutate: async (editedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["allCategories"] });
      const previousCategories = queryClient.getQueryData(["allCategories"]);
      queryClient.setQueryData(["allCategories"], (old: Category[]) => {
        if (!old) return old;
        return [
          editedCategory,
          ...old.filter((cat) => cat.id !== editedCategory.id),
        ];
      });
      return { previousCategories };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["allCategories"], context?.previousCategories);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["allCategories"] }),
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: async (category: Category) => {
      return await deleteAvailableCategoryFn(category);
    },

    onMutate: async (deletedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["allCategories"] });
      const previousCategories = queryClient.getQueryData(["allCategories"]);
      // old is entire list categories
      queryClient.setQueryData(["allCategories"], (old: Category[]) => {
        if (!old) return old;
        return old.filter((category) => category.id !== deletedCategory.id);
      });
      return { previousCategories };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["allCategories"], context?.previousCategories);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
    },
  });

  return {
    getItem,
    getAllItems,
    editClothingItem,
    addClothingItem,
    deleteClothingItem,
    addCategory,
    getCategories,
    editCategory,
    deleteCategory,
  };
};
export { useClothingItems };

// Helper functions
async function addClothingItemFn(formData: FormData) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );
  return response;
}

async function getClothingItems(
  search: string | null | undefined,
  category: string | null | undefined,
) {
  const categoryParam = category ? `?category=${category}` : "";
  const searchParam = search
    ? category
      ? `&search=${search}`
      : `?search=${search}`
    : "";
  try {
    const res = await fetchWithAuth(
      process.env.NEXT_PUBLIC_API_URL +
        "/v1/clothing_items/" +
        categoryParam +
        searchParam,
      {
        method: "GET",
        credentials: "include",
      },
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

async function getClothingItem(id: number) {
  const res = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/clothing_items/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch item");
  return res.json();
}

async function editClothingItemFn(id: number, formData: FormData) {
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
    const res = await fetchWithAuth(
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
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error editing item:", error);
  }
}

// Soft delete — sends DELETE request, backend sets is_deleted=True instead of removing the record
async function deleteClothingItemFn(id: number) {
  try {
    const res = await fetchWithAuth(
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
    return res;
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

// fetch available categories.
async function fetchAvailableCategoriesFn() {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errorResponse = await response.json();
    alert(`Failed to fectch categories: ${errorResponse.error}`);
  }
}

// add new category

async function addNewCategoryFn(name: string) {
  const data = {
    name: `${name}`,
  };
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (response.ok) {
    const res = await response.json();
    return res;
  } else {
    const errorResponse = await response.json();
    alert(`Failed to add new category: ${name}: ${errorResponse.error}`);
  }
}
// edit available category
async function editAvailableCategoryFn(category: Category) {
  console.log(category.name);
  const data = {
    id: `${category.id}`,
    name: `${category.name}`,
  };
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/${category.id}/`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (response.ok) {
    const res = await response.json();
    return res;
  } else {
    const errorResponse = await response.json();
    alert(`Failed to edit: ${category.name}: ${errorResponse.error}`);
  }
}

// delete available category
async function deleteAvailableCategoryFn(category: Category) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/${category.id}/`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (response.ok) {
    return response;
  } else {
    const errorResponse = await response.json();
    alert(`Failed to delete: ${category.name}: ${errorResponse.error}`);
  }
}
