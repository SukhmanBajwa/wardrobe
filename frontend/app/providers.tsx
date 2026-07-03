"use client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useContext, useState } from "react";
import { ErrorContext } from "./context/errorContext";
import { QueryCache } from "@tanstack/react-query";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import ErrorBanner from "@/components/ErrorBanner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) =>
            setErrorMessages((errorList) => [error.message, ...errorList]),
        }),
        mutationCache: new MutationCache({
          onError: (error) =>
            setErrorMessages((errorList) => [error.message, ...errorList]),
        }),
      }),
  );

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <QueryClientProvider client={queryClient}>
        <ErrorContext.Provider value={{ errorMessages, setErrorMessages }}>
          {children}
          {errorMessages.length > 0 && (
            <div className="flex flex-col z-[1000] fixed top-4 left-1/2 -translate-x-1/2 gap-1 ">
              {errorMessages.map((msg, index) => (
                <ErrorBanner
                  key={index}
                  message={msg}
                  onClose={() =>
                    setErrorMessages((prev) =>
                      prev.filter((_, i) => i != index),
                    )
                  }
                />
              ))}
            </div>
          )}
        </ErrorContext.Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
