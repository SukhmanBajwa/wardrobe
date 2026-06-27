"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData, useAuth } from "@/functions/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  // the colon syntax data: user means "take the property called data, but call it user in my local scope instead.
  const { userData } = useUserData();
  const { Login, GoogleLogin } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      await GoogleLogin({ code: response.code });
    },
    flow: "auth-code",
  });

  useEffect(() => {
    if (userData.data) {
      router.push("/gallery");
    }
  }, [userData.data, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/wardrobe.svg"
            alt="Wardrobe logo"
            width={100}
            height={20}
            priority
            className="mx-auto mb-3 rounded-xl"
          />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Wardrobe
          </h1>
          <p className="mt-2 text-sm text-gray-400">Login to get started</p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50 border-t-2 border-t-indigo-500">
          <form
            className="flex flex-col gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              // FormData reads input values by their `name` attribute from the submitted form
              // new FormData(e.currentTarget) reads all the name/value pairs from all inputs inside that form.
              const formData = new FormData(e.currentTarget);
              const username = formData.get("username") as string;
              const password = formData.get("password") as string;

              const loginResponse: Response = await Login({
                username,
                password,
              });
              if (loginResponse.ok) {
                await queryClient.invalidateQueries({ queryKey: ["whoami"] });
                router.push("/gallery");
              } else {
                setError("Invalid username or password. Please try again.");
              }
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                onChange={() => setError(null)}
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                onChange={() => setError(null)}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              className="mt-2 w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Login
            </button>
          </form>
          <div className="mt-2 flex flex-col items-center justify-evenly gap-2 ">
            <button
              type="button"
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center min-h-12 max-h-12 gap-2 py-3 px-4 rounded-lg border border-gray-600 bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              <Image
                src="/Google_Favicon_2025.svg"
                alt="Google Logo"
                width={25}
                height={25}
              />
              Sign in with Google
            </button>
            <a
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              {" "}
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
