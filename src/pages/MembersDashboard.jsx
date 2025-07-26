import { Button, Group, Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { Navigate } from "react-router";
import CommitteeDashboard from "../components/CommitteeDashboard";
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
  useEffect(() => {
    if (committees?.length > 0) {
      setCommittee({ value: committees[0]?.committee_id });
    }
  }, [committees]);

  if (isLoadingCommittee) return <PageLoader></PageLoader>;

  const loadedCommittee = Array.from(committees).filter(
    (c) => c?.committee_id === committee?.value
  )[0]?.committee;
  const committeeSelection = (
    <>
      <Select
        label="Select a Committee"
        placeholder="Select Committee"
        data={committees?.map((committee) => ({
          label: committee?.committee?.name,
          value: committee?.committee_id,
        }))}
        onChange={(_, option) => setCommittee(option)}
        value={committee?.value}
        searchable
      ></Select>
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
      {members && (
        <Group p={"md"}>
          <Button
            onClick={() => setFinalCommittee(committee)}
            fullWidth
            color="blue"
            variant="light"
            size="sm"
            mt={"md"}
            rightSection={<FaCoins />}
          >
            Go to Payments Page
          </Button>
        </Group>
      )}
      {!!loadedCommittee && (
        <CommitteeDashboard committee={loadedCommittee} members={members}>
          {" "}
        </CommitteeDashboard>
      )}
    </WebFrame>
  );
}

export default MembersDashboard;
