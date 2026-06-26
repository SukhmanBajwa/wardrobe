import { useUserData } from "@/functions/auth";
import { useAuth } from "@/functions/auth";
import { X } from "lucide-react";
import { useState } from "react";

export default function Account({ onClose }: { onClose: () => void }) {
  const { ChangePassword } = useAuth();
  const { userData } = useUserData();
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const mismatch =
    password1.length > 0 && password2.length > 0 && password1 !== password2;
  const canSubmit =
    password1.length > 0 && password2.length > 0 && password1 === password2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-700/60 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-100">Account</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-gray-100 active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-6">
          {/* Account info */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Name
              </span>
              <span className="text-gray-200">
                {`${userData.data?.first_name ?? ""} ${userData.data?.last_name ?? ""}`.trim() ||
                  "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Email
              </span>
              <span className="text-gray-200">
                {userData.data?.email || "N/A"}
              </span>
            </div>
          </div>

          {/* Change password */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
            <h2 className="border-b border-gray-700/60 pb-2 text-base font-semibold text-gray-100">
              Change password
            </h2>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-password" className="text-sm text-gray-300">
                New password
              </label>
              <input
                id="new-password"
                name="new_password"
                onChange={(e) => setPassword1(e.target.value)}
                type="password"
                placeholder="••••••••"
                maxLength={30}
                className="h-12 rounded-lg border border-gray-700 bg-gray-900 px-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirm-password"
                className="text-sm text-gray-300"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                name="confirm_password"
                onChange={(e) => setPassword2(e.target.value)}
                type="password"
                placeholder="••••••••"
                maxLength={30}
                className={`h-12 rounded-lg border bg-gray-900 px-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 ${
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
              type="button"
              disabled={!canSubmit}
              onClick={() => ChangePassword(password1, password2)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              Change password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
