import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import AdminDashboard from "./pages/AdminDashboard";
import BecomeOrganizer from "./pages/BecomeOrganizer";
import Invite from "./pages/Invite";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { routes } from "./utils/routes";
import { AuthProvider } from "./utils/supabaseHook";

const router = createBrowserRouter([
  {
    path: routes.Home,
    element: <App />,
  },
  {
    path: routes.OrganizerDashboard,
    element: (
      <ProtectedRoute>
        <OrganizerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.AdminDashboard,
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.BecomeOrganizer,
    element: (
      <ProtectedRoute>
        <BecomeOrganizer />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.Invite,
    element: <Invite />,
  },
]);
const theme = createTheme({
  primaryColor: "orange",
});
const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 600,
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Notifications />
          <ReactQueryDevtools />
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>
);
