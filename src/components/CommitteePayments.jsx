import { ActionIcon, Group, Notification, Stack, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { getCommitteeForUser } from "../utils/databaseHelper";
import useSupabase from "../utils/supabaseHook";
import PageLoader from "./PageLoader";

function CommitteePayments({ id, back }) {
  const { user } = useSupabase();
  const { data, isLoading } = useQuery({
    queryKey: ["committee", id],
    queryFn: () => getCommitteeForUser(id),
  });
  if (isLoading) return <PageLoader></PageLoader>;
  const committee = data[0];
  const head = (
    <Group>
      {" "}
      <ActionIcon onClick={back}>
        {" "}
        <IoIosArrowBack />
      </ActionIcon>
      <Title order={3}>Committee Payments</Title>
    </Group>
  );
  if (committee?.status === "ready")
    return (
      <Stack>
        {head}

        <Notification
          withBorder
          color="red"
          radius="md"
          title={committee?.name}
          withCloseButton={false}
        >
          Committee had not started yet. Please ask your organizer to start the
          Committee
        </Notification>
      </Stack>
    );
  return <Stack>{head}</Stack>;
}

export default CommitteePayments;
