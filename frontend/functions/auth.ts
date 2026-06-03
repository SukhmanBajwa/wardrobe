export async function sendLogin(username: string, password: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/auth/login/",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    },
  );
  return res;
}
