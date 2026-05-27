export async function addItem(
  name: string,
  description: string,
  image_url: string,
) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        description: description,
        image_url: image_url,
      }),
    },
  );
  return response;
}
