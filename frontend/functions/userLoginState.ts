import { useQuery } from "@tanstack/react-query";
const useLoginData = () => {
  const userData = useQuery({
    queryKey: ["whoami"],
    queryFn: WhoAmI,
  });
  return userData;
};
export { useLoginData };

async function WhoAmI(): Promise<UserData | null> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/auth/user/",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (response.ok) {
    const userData: UserData = await response.json();
    console.log(userData.first_name);
    return userData;
  }
  return null;
}
