import { createContext, Context } from "react";

interface ErrorContextType {
  errorMessages: string[];
  setErrorMessages: (
    messages: string[] | ((prev: string[]) => string[]),
  ) => void;
}

export const ErrorContext = createContext<ErrorContextType>({
  errorMessages: [],
  setErrorMessages: () => {},
});
