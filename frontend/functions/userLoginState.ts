export async function WhoAmI(): Promise<UserData | null> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/auth/user/",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (response.ok) {
    const userData: UserData = await response.json();
    return userData;
  }
  return null;
}
