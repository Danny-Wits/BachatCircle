import { Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router";
import PageLoader from "../components/PageLoader";
import { checkOrganizer } from "../utils/databaseHelper";
import { routes } from "../utils/routes";
import useSupabase from "../utils/supabaseHook";
import WebFrame from "../WebFrame";

function OrganizerDashboard() {
  const { user } = useSupabase();
  const { data: isOrganizer, isLoading } = useQuery({
    queryKey: ["organizer"],
    queryFn: () => checkOrganizer(user?.id),
  });
  if (isLoading) return <PageLoader></PageLoader>;
  if (!isOrganizer) return <Navigate to={routes.BecomeOrganizer}></Navigate>;
  return (
    <WebFrame>
      <Title>Organizer Dashboard</Title>
    </WebFrame>
  );
}

export default OrganizerDashboard;
