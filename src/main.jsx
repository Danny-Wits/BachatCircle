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
]);
const theme = createTheme({
  primaryColor: "orange",
});
const queryClient = new QueryClient();
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
