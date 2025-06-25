import { ActionIcon, Anchor, Avatar, Group, Table, Text } from "@mantine/core";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { timeAgo } from "../utils/databaseHelper";

export default function UsersTable({ data, handleVerification }) {
  const rows = data?.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Avatar color="initials" radius="xl" name={item.name} />
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="light"
          color={item.is_verified ? "green" : "red"}
          onClick={() => {
            if (!item.is_verified) {
              handleVerification(item.id);
            } else {
              notifications.show({
                title: "Error",
                message: "User is already verified",
                color: "red",
              });
            }
          }}
          title={item.is_verified ? "Verified" : "Not Verified"}
        >
          <RiVerifiedBadgeFill size={16} stroke={1.5} />
        </ActionIcon>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.location}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{timeAgo(item.created_at)}</Text>
      </Table.Td>

      <Table.Td>
        <Anchor component="button" size="sm">
          {item.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.phone}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={400}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Employee</Table.Th>
            <Table.Th>Verify</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
