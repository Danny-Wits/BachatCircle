import { Center, Loader, Stack, Text, Title } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router";
import WebFrame from "../WebFrame";
import UsersTable from "../components/UserTable";
import {
  checkAdmin,
  getOrganizers,
  verifyOrganizer,
} from "../utils/databaseHelper";
import useSupabase from "../utils/supabaseHook";

function AdminDashboard() {
  const queryClient = useQueryClient();
  const { user, logout } = useSupabase();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: () => checkAdmin(user?.id),
  });
  const { data: organizers, isLoadingOrg } = useQuery({
    queryKey: ["organizers"],
    queryFn: () => getOrganizers(),
  });
  if (isLoading || isLoadingOrg)
    return (
      <Center h={"100vh"}>
        <Loader></Loader>
      </Center>
    );
  if (!isAdmin) return <Navigate to="/"></Navigate>;
  const handleVerification = async (org_id) => {
    await verifyOrganizer(org_id);
    queryClient.refetchQueries(["organizers"]);
  };
  return (
    <WebFrame>
      <Stack>
        <Title order={2}>Admin Dashboard</Title>
        <Stack p="lg">
          <Text>Verify Organizers </Text>
          <UsersTable
            data={organizers}
            handleVerification={handleVerification}
          ></UsersTable>
        </Stack>
      </Stack>
    </WebFrame>
  );
}

export default AdminDashboard;
