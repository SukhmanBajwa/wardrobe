export async function fetchClothingItems() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
    { method: "GET", credentials: "include" },
  );
  return res;
}
