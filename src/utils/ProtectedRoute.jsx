import { Center, Loader } from "@mantine/core";
import { Navigate } from "react-router";
import useSupabase from "./supabaseHook";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSupabase();
  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader></Loader>
      </Center>
    );
  }
  if (!children || !isAuthenticated) return <Navigate to="/" />;
  return children;
}

export default ProtectedRoute;
