import { createContext, useContext } from "react";

interface GlobalProps {
  openCart: () => void;
}

export const GlobalPropsContext = createContext<GlobalProps | null>(null);

export const useGlobalProps = () => {
  const context = useContext(GlobalPropsContext);
  if (!context) {
    throw new Error("useGlobalProps must be used within GlobalPropsProvider");
  }
  return context;
};
