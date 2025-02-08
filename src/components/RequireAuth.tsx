// src/components/RequireAuth.tsx

import { Navigate } from "react-router-dom";

import { ReactNode } from "react";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = !!localStorage.getItem("UserID");

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default RequireAuth;
