import type React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  role: "TEACHER" | "STUDENT";
  children: React.ReactNode;
}

export default function RequireRole({ role, children }: Props) {
  const savedRole = sessionStorage.getItem("role");

  if (savedRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
