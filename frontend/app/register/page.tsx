"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { useUserData, useAuth } from "@/functions/auth";
import ErrorBanner from "@/components/ErrorBanner";
import { ErrorContext } from "../context/errorContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const { userData } = useUserData();
  const { Register } = useAuth();
  const router = useRouter();
  const errorContext = useContext(ErrorContext);

  const mismatch =
    password1.length > 0 && password2.length > 0 && password1 !== password2;
  const canSubmit =
    password1.length > 0 && password2.length > 0 && password1 === password2;

  useEffect(() => {
    if (userData.data) {
      router.push("/gallery");
    }
  }, [userData.data, router]);

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
          <p className="mt-2 text-sm text-gray-400">
            Create your account to get started
          </p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50 border-t-2 border-t-indigo-500">
          <form
            className="flex flex-col gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              await Register(username, email, password1, password2);
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
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                onInput={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                onInput={(e) => {
                  setEmail(e.currentTarget.value);
                  e.currentTarget.setCustomValidity("");
                }}
                onInvalid={(e) => {
                  e.preventDefault();
                  errorContext.setErrorMessages([
                    "Please enter a valid email address",
                  ]);
                }}
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
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                onInput={(e) => setPassword1(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirm-password"
                className="text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                onInput={(e) => setPassword2(e.currentTarget.value)}
                className={`w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                mismatch
                    ? "border-red-500/60 focus:ring-red-500"
                    : "border-gray-700 focus:ring-indigo-500"
                }`}
              />
              {mismatch && (
                <p className="text-xs text-red-400">
                  Passwords don&apos;t match.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/loginPage"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Sign in <br></br>
            </a>
            or with{" "}
            <a
              href="/loginPage"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Google
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
