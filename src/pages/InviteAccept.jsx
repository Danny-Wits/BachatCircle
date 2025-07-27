import { Button, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import WebFrame from "../WebFrame";
import PageLoader from "../components/PageLoader";
import PageTitle from "../components/PageTitle";
import { acceptInvite, getInvites, timeAgo } from "../utils/databaseHelper";
import useSupabase from "../utils/supabaseHook";

function InviteAccept() {
  const { user } = useSupabase();
  const { data, isLoading } = useQuery({
    queryKey: ["invites"],
    queryFn: () => getInvites(user?.email),
  });
  const queryClient = useQueryClient();

  const { mutate: accept, isPending } = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.refetchQueries(["invites"]);
    },
  });
  if (isLoading) return <PageLoader></PageLoader>;
  return (
    <WebFrame>
      <PageTitle title="Invites"></PageTitle>
      <Stack>
        {data?.map((invite) => (
          <Paper key={invite.id} withBorder radius="md" p="xs">
            <Group gap={"lg"}>
              {" "}
              <ThemeIcon size={24} radius="xl">
                <IoIosNotificationsOutline size={16} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text fw={700} size="xl">
                  {invite?.token.split("|")[3]}
                </Text>
                <Text
                  size="10px"
                  fw={700}
                  c={invite.used ? "green" : "red"}
                  tt="uppercase"
                >
                  {invite?.used ? "Accepted" : "Pending"}
                </Text>
              </Stack>
              <Button
                color={invite.used ? "green" : "red"}
                variant="light"
                onClick={() => accept(invite.id)}
                disabled={invite.used}
                loading={isPending}
                rightSection={<FaCheckCircle />}
              >
                {" "}
                Accept
              </Button>
              <Stack ml={"auto"} justify="space-around" gap={0}>
                <Text size="xs">
                  <b> {invite?.token.split("|")[2]}</b>
                </Text>
                <Text c={"dimmed"} size="xs">
                  {timeAgo(invite?.created_at)}
                </Text>
              </Stack>
            </Group>
          </Paper>
        ))}
      </Stack>
    </WebFrame>
  );
}

export default InviteAccept;
