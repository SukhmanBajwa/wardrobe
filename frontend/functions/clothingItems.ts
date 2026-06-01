export async function fetchClothingItems(
  search: string = "",
  category: string = "",
) {
  const categoryParam = category ? `?category=${category}` : "";
  const searchParam = search ? (category ? `&search=${search}` : "") : "";
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
}
