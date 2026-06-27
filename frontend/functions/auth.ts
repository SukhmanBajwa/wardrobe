import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "./fetchWithAuth";
import { friendlyError } from "./friendlyError";

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
    const response = await fetch(
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
    return response;
  };

  const Logout = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/auth/logout/",
      {
        method: "POST",
        credentials: "include",
      },
    );
    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: ["whoami"] });
      router.push("/loginPage/");
      return response;
    }
  };

  const ChangePassword = async (password1: string, password2: string) => {
    const response = await fetchWithAuth(
      process.env.NEXT_PUBLIC_API_URL + `/api/auth/password/change/`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          new_password1: password1,
          new_password2: password2,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  };

  const Register = async (
    username: string,
    email: string,
    password1: string,
    password2: string,
  ) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/auth/registration/",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          email: email,
          password1: password1,
          password2: password2,
        }),
      },
    );
    if (!response.ok) {
      throw friendlyError(response.status, "register");
    }
    const loginResponse: Response = await Login({
      username,
      password: password1,
    });
    if (loginResponse.ok) router.push("/gallery");
  };

  const GoogleLogin = async ({ code }: { code: string }) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/auth/google/",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      },
    );
    if (response.ok) {
      await queryClient.invalidateQueries({ queryKey: ["whoami"] });
      router.push("/gallery");
    }
  };

  return { Login, Logout, ChangePassword, Register, GoogleLogin };
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
