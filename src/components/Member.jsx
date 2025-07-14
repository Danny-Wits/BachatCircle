import { Avatar, Group, Stack, Text } from "@mantine/core";
import useSupabase from "../utils/supabaseHook";

function Member({ user }) {
  const { user: currentUser } = useSupabase();
  return (
    <Group>
      <Avatar
        src={user?.avatar_url}
        radius="xl"
        name={user?.full_name || "Anonymous"}
        color="initials"
      ></Avatar>
      <Stack gap={0}>
        <Text fw={600}>
          {user?.full_name || "Anonymous"}{" "}
          {currentUser?.id === user?.id && "(You)"}
        </Text>
        <Text size="xs" c={"dimmed"}>
          {user?.email}
        </Text>
      </Stack>
    </Group>
  );
}

export default Member;
