import { Avatar, Group, Stack, Text } from "@mantine/core";

function Member({ user }) {
  return (
    <Group>
      <Avatar
        src={user?.avatar_url}
        radius="xl"
        name={user?.full_name || "Anonymous"}
        color="initials"
      ></Avatar>
      <Stack gap={0}>
        <Text fw={600}>{user?.full_name || "Anonymous"}</Text>
        <Text size="xs" c={"dimmed"}>
          {user?.email}
        </Text>
      </Stack>
    </Group>
  );
}

export default Member;
