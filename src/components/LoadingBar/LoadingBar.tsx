import React from "react";
import s from "./LoadingBar.module.css";

interface LoadingBarProps {
  loading: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ loading }) => {
  return <div className={`${s.loadingBar} ${loading ? s.active : ""}`} />;
};
