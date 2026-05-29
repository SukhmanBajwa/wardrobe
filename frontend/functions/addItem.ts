export async function addItem(
  //   name: string,
  //   category: number,
  //   description: string,
  //   image_url: string,
  formData: FormData,
) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );
  console.log(response);
  return response;
  //   const response = await fetch(
  //     process.env.NEXT_PUBLIC_API_URL + "/v1/clothing_items/",
  //     {
  //       method: "POST",
  //       credentials: "include",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: name,
  //         category: category,
  //         description: description,
  //         image_url: image_url,
  //       }),
  //     },
  //   );
  //   return response;
}
