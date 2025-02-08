// src/components/RequireAuth.tsx

import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("UserID");

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default RequireAuth;
