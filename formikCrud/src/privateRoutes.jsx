import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  let userRole;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT safely
    userRole = payload.role;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("token"); // remove corrupted token
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard if role not allowed
    return userRole === "teacher" ? (
      <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/student-dashboard" />
    );
  }

  return children;
}
