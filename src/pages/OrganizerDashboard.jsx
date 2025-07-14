import { Button, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { CiUser } from "react-icons/ci";
import { Navigate, useNavigate } from "react-router";
import CommitteeDashboard from "../components/CommitteeDashboard";
import PageLoader from "../components/PageLoader";
import PageTitle from "../components/PageTitle";
import CreateCommittee from "../components/StartCommittee";
import {
  checkOrganizer,
  getCommittee,
  getCommitteeMembers,
} from "../utils/databaseHelper";
import { routes } from "../utils/routes";
import useSupabase from "../utils/supabaseHook";
import WebFrame from "../WebFrame";

function OrganizerDashboard() {
  const { user } = useSupabase();
  const navigate = useNavigate();
  const { data: isOrganizer, isLoading } = useQuery({
    queryKey: ["organizer"],
    queryFn: () => checkOrganizer(user?.id),
  });
  const { data: committee, isLoading: isLoadingCommittee } = useQuery({
    queryKey: ["committee"],
    queryFn: () => getCommittee(user?.id),
  });
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => getCommitteeMembers(committee?.[0]?.id),
    enabled: !!committee?.[0]?.id,
  });
  if (isLoading || isLoadingCommittee) return <PageLoader></PageLoader>;
  if (!isOrganizer) return <Navigate to={routes.BecomeOrganizer}></Navigate>;
  if (committee?.length == 0) {
    return (
      <WebFrame>
        <CreateCommittee org_id={user?.id} />
      </WebFrame>
    );
  }
  return (
    <WebFrame>
      <PageTitle title="Organizer Dashboard" />
      <Stack p="lg">
        <Button
          fullWidth
          variant="outline"
          leftSection={<CiUser />}
          onClick={() => {
            navigate(routes.Members);
          }}
        >
          {" "}
          Go to Members Dashboard
        </Button>
      </Stack>

      <CommitteeDashboard
        committee={committee[0]}
        members={members}
      ></CommitteeDashboard>
    </WebFrame>
  );
}

export default OrganizerDashboard;
