import { useUser } from "../features/authentication/useUser";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute({ children, type = "redirect" }) {
  const navigate = useNavigate();

  // 1. Load the authenticated user

  const { user, isLoading, isAuthenticated } = useUser();

  // 2. If ther is no authenticated user, display link to Login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading && type === "redirect")
        navigate("/login");
    },
    [isAuthenticated, isLoading, navigate, type]
  );

  // 3. While Loading, show a spinner

  if (isLoading) return;
  <LoadingSpinner />;

  // 4 If not authenticated and type is "guide" show message

  if (!isAuthenticated && type === "guide") {
    return <p>You need to be logged in to access this page.</p>;
  }

  // 5. If there is a user, render Form

  if (isAuthenticated) return children;
}

export default ProtectedRoute;
