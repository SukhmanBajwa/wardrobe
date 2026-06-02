export async function fetchClothingItems(
  search: string = "",
  category: string = "",
) {
  const categoryParam = category ? `?category=${category}` : "";
  const searchParam = search ? (category ? `&search=${search}` : "") : "";
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
    console.error("Error deleting data:", error);
  }
}
