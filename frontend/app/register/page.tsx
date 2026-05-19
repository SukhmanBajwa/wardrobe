"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const router = useRouter();

  async function sendRegisteration(
    username: string,
    email: string,
    password1: string,
    password2: string,
  ) {
    console.log("Sending registration data:");
    const res = await fetch(
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
    if (res.ok) {
      router.push("/Home");
    } else {
      const data = await res.json();
      alert(`Registration failed: ${JSON.stringify(data)}`);
    }
  }

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
          <p className="mt-2 text-sm text-gray-400">
            Create your account to get started
          </p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50 border-t-2 border-t-indigo-500">
          <form
            className="flex flex-col gap-5"
            onSubmit={async (e) => {
              console.log("form submitted");
              e.preventDefault();
              await sendRegisteration(username, email, password1, password2);
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
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
                onInput={(e) => setEmail(e.currentTarget.value)}
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
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                onInput={(e) => setPassword2(e.currentTarget.value)}
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Sign in <br></br>
            </a>
            or with{" "}
            <a
              href="/login"
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
