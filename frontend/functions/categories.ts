export async function fetchCategories() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/v1/categories/", {
    method: "GET",
    credentials: "include",
  });
  return res;
}
