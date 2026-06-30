"use client";

import Image from "next/image";
import { useContext } from "react";
import { useAuth } from "@/functions/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { ErrorContext } from "../context/errorContext";
import ErrorBanner from "@/components/ErrorBanner";

export default function LoginPage() {
  // the colon syntax data: user means "take the property called data, but call it user in my local scope instead.

  const { loginMutation, googleLoginMutation } = useAuth();
  const errorContext = useContext(ErrorContext);

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      googleLoginMutation.mutate({ code: response.code });
    },
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 px-4">
      {errorContext.errorMessages.length > 0 && (
        <div className="flex flex-col fixed top-4 left-1/2 -translate-x-1/2 z-100 gap-1 ">
          {errorContext.errorMessages.map((msg, index) => (
            <ErrorBanner
              key={index}
              message={msg}
              onClose={() =>
                errorContext.setErrorMessages((prev) =>
                  prev.filter((_, i) => i != index),
                )
              }
            />
          ))}
        </div>
      )}
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
            onSubmit={(e) => {
              e.preventDefault();
              // FormData reads input values by their `name` attribute from the submitted form
              // new FormData(e.currentTarget) reads all the name/value pairs from all inputs inside that form.
              const formData = new FormData(e.currentTarget);
              const username = formData.get("username") as string;
              const password = formData.get("password") as string;
              loginMutation.mutate({ username, password });
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
                required
                onChange={(e) => e.currentTarget.setCustomValidity("")}
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
                required
                onChange={(e) => e.currentTarget.setCustomValidity("")}
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
