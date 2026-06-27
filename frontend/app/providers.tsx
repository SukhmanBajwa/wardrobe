"use client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { ErrorContext } from "./context/errorContext";
import { QueryCache } from "@tanstack/react-query";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

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
        </ErrorContext.Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
