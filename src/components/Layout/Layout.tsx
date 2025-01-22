import { ReactNode } from "react";
import s from "./Layout.module.css";

type LayoutProps = {
  className?: string;
  children: ReactNode;
};

export const Layout = ({ className, children }: LayoutProps) => {
  return <div className={`${s.layout} ${className || ""}`}>{children}</div>;
};
