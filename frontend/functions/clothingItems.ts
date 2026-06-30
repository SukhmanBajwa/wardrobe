import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchWithAuth } from "./fetchWithAuth";
import { friendlyError } from "./friendlyError";

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

      const previousData = queryClient.getQueriesData<ClothingItem[]>({
        queryKey: ["clothingItems"],
      });
      queryClient.setQueriesData<ClothingItem[]>(
        { queryKey: ["clothingItems"] },
        (old) => {
          if (!old) return old;
          return old.filter((item) => item.id !== deletedItem);
        },
      );

      return { previousData };
    },
    onError: (err, variables, context) => {
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
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

  // Get Tags
  const getTags = useQuery({
    queryKey: ["allTags"],
    queryFn: getTagsFn,
  });

  // Delete Tag
  const deleteTag = useMutation({
    mutationFn: async (tag: Tag) => {
      return await deleteAvailableTagFn(tag);
    },
    onMutate: async (deletedTag: Tag) => {
      await queryClient.cancelQueries({ queryKey: ["allTags"] });
      const previousTags = queryClient.getQueryData(["allTags"]);
      queryClient.setQueryData(["allTags"], (old: Tag[]) => {
        if (!old) return old;
        return old.filter((tag) => tag.id !== deletedTag.id);
      });
      return { previousTags };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["allTags"], context?.previousTags);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allTags"] });
      queryClient.invalidateQueries({ queryKey: ["clothingItems"] });
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
    getTags,
    deleteTag,
  };
};
export { useClothingItems };

// Helper functions
async function addClothingItemFn(formData: FormData) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
    { method: "POST", body: formData },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "add clothing item", response);
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
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL +
      "/v1/clothing_items/" +
      categoryParam +
      searchParam,
    { method: "GET" },
  );
  if (!response.ok)
    throw await friendlyError(
      response.status,
      "fetch clothing items",
      response,
    );
  return await response.json();
}

async function getClothingItem(id: number) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/clothing_items/${id}`,
    { method: "GET" },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "fetch clothing item", response);
  return response.json();
}

async function editClothingItemFn(id: number, formData: FormData) {
  let bodyData: FormData | Record<string, string> = {};
  if (formData.has("image")) {
    bodyData = formData;
  } else {
    for (let [key, value] of formData.entries()) {
      (bodyData as Record<string, string>)[key] = value as string;
    }
  }
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/clothing_items/${id}/`,
    {
      method: "PATCH",
      headers: formData.has("image")
        ? undefined
        : { "Content-Type": "application/json" },
      body: formData.has("image")
        ? (bodyData as FormData)
        : JSON.stringify(bodyData),
    },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "edit clothing item", response);
  return response.json();
}

async function deleteClothingItemFn(id: number) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/clothing_items/${id}/`,
    { headers: { "Content-Type": "application/json" }, method: "DELETE" },
  );
  if (!response.ok)
    throw await friendlyError(
      response.status,
      "delete clothing item",
      response,
    );
  return response;
}

async function fetchAvailableCategoriesFn() {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/`,
    { method: "GET" },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "fetch categories", response);
  return response.json();
}

async function addNewCategoryFn(name: string) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "add category", response);
  return response.json();
}

async function editAvailableCategoryFn(category: Category) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/${category.id}/`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: `${category.id}`, name: `${category.name}` }),
    },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "edit category", response);
  return response.json();
}

async function deleteAvailableCategoryFn(category: Category) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/categories/${category.id}/`,
    { method: "DELETE" },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "delete category", response);
  return response;
}

async function getTagsFn() {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/tags/`,
    { method: "GET" },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "fetch tags", response);
  return response.json();
}

async function deleteAvailableTagFn(tag: Tag) {
  const response = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/v1/tags/${tag.id}/`,
    { method: "DELETE" },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "delete tag", response);
  return response;
}
