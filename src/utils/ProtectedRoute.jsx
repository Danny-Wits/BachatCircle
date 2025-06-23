import { Center, Loader } from "@mantine/core";
import { Navigate } from "react-router";
import useSupabase from "./supabaseHook";

function ProtectedRoute({ children, orgAuth = false }) {
  const { isAuthenticated, isOrganizer, isLoading, isAdmin } = useSupabase();
  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader></Loader>
      </Center>
    );
  }
  if (!children || !isAuthenticated) return <Navigate to="/" />;
  if (orgAuth && !isOrganizer) return <Navigate to="/" />;
  return children;
}

export default ProtectedRoute;
