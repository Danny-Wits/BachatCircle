import { Button, Divider, Paper, Select, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate } from "react-router";
import Members from "../components/Members";
import PageLoader from "../components/PageLoader";
import PageTitle from "../components/PageTitle";
import {
  getCommitteeMembers,
  getCommitteesForMember,
} from "../utils/databaseHelper";
import { routes } from "../utils/routes";
import useSupabase from "../utils/supabaseHook";
import WebFrame from "../WebFrame";

function MembersDashboard() {
  const { user } = useSupabase();
  const [committee, setCommittee] = useState(null);
  const [finalCommittee, setFinalCommittee] = useState(null);
  const { data: committees, isLoading: isLoadingCommittee } = useQuery({
    queryKey: ["committees"],
    queryFn: () => getCommitteesForMember(user?.id),
  });
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["members", committee?.value],
    queryFn: () => getCommitteeMembers(committee?.value),
    enabled: !!committee?.value,
  });
  if (isLoadingCommittee) return <PageLoader></PageLoader>;
  const committeeSelection = (
    <>
      <Select
        label="Select a Committee"
        placeholder="Select Committee"
        data={committees?.map((committee) => ({
          label: committee?.committee?.name,
          value: committee?.committee_id,
        }))}
        value={committee?.committee?.name}
        onChange={(_, option) => setCommittee(option)}
        searchable
      ></Select>
      {members && (
        <Paper withBorder radius="md" p="xs">
          <Text fw={600}> {committee?.label}</Text>
          <Button
            onClick={() => setFinalCommittee(committee)}
            fullWidth
            variant="light"
            size="sm"
          >
            Select Committee
          </Button>
          <Divider my="sm"></Divider>
          <Text c="dimmed" mb="xs">
            {" "}
            Members: {members?.length}
          </Text>
          <Members members={members}></Members>
        </Paper>
      )}
    </>
  );
  if (finalCommittee)
    return (
      <Navigate
        to={routes.CommitteePayments.replace(":id", finalCommittee?.value)}
      ></Navigate>
    );
  return (
    <WebFrame>
      <PageTitle title="Members Dashboard" />
      {!finalCommittee && committeeSelection}
    </WebFrame>
  );
}

export default MembersDashboard;
