"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserData, useAuth } from "@/functions/auth";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // the colon syntax data: user means "take the property called data, but call it user in my local scope instead.
  const { userData } = useUserData();
  const { Login } = useAuth();

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
                const errorResponse = await loginResponse.json();
                alert(`Login failed: ${JSON.stringify(errorResponse)}`);
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
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Sign in with{" "}
            <a
              href="/loginPage"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Google
            </a>{" "}
            or Register
            <a
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              {" "}
              here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
