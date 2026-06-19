import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const useUserData = () => {
  const userData = useQuery({
    queryKey: ["whoami"],
    queryFn: User,
  });
  return { userData };
};
export { useUserData };

const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const Login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
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
  };

  const Logout = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/auth/logout/",
      {
        method: "POST",
        credentials: "include",
      },
    );
    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ["whoami"] });
      router.push("/loginPage/");
      return res;
    }
  };

  return { Login, Logout };
};

const User = async () => {
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
};
export { useAuth };
