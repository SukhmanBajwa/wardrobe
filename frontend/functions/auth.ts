import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "./fetchWithAuth";
import { friendlyError } from "./friendlyError";

// --- User Data Hook ---
const useUserData = () => {
  const userData = useQuery({
    queryKey: ["whoami"],
    queryFn: fetchUser,
  });
  return { userData };
};
export { useUserData };

// --- Auth Hook ---
const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      return await login(username, password);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["whoami"] });
      router.push("/gallery");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/logout/",
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!response.ok)
        throw await friendlyError(response.status, "logout", response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whoami"] });
      router.push("/loginPage/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({
      username,
      email,
      password1,
      password2,
    }: {
      username: string;
      email: string;
      password1: string;
      password2: string;
    }) => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/registration/",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password1, password2 }),
        },
      );
      if (response.ok) {
        await login(username, password1);
        router.push("/gallery");
      } else {
        throw await friendlyError(response.status, "register", response);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["whoami"] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({
      password1,
      password2,
    }: {
      password1: string;
      password2: string;
    }) => {
      const response = await fetchWithAuth(
        process.env.NEXT_PUBLIC_API_URL + `/api/auth/password/change/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            new_password1: password1,
            new_password2: password2,
          }),
        },
      );
      if (!response.ok)
        throw await friendlyError(response.status, "change password", response);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/google/",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        },
      );
      if (!response.ok)
        throw await friendlyError(response.status, "google login", response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["whoami"] });
      router.push("/gallery");
    },
  });

  return {
    loginMutation,
    logoutMutation,
    registerMutation,
    changePasswordMutation,
    googleLoginMutation,
  };
};
export { useAuth };

// --- Helper functions ---
async function fetchUser(): Promise<UserData | null> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/auth/user/",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (response.ok) return response.json();
  return null;
}

async function login(username: string, password: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/auth/login/",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    },
  );
  if (!response.ok)
    throw await friendlyError(response.status, "login", response);
  return response;
}
