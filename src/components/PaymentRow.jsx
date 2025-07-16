import {
  Avatar,
  Group,
  NumberFormatter,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";

function PaymentRow({ name, url, amount, status }) {
  if (!name) name = "Anonymous";
  return (
    <Paper withBorder radius="md" p={"xs"} shadow="xs">
      <Group>
        <Group>
          <Avatar src={url} radius="xl" name={name} color="initials" />
          <Stack gap={0}>
            <Text size="sm" fw={600}>
              {name}
            </Text>
            <Text size="sm" fw={700}>
              <NumberFormatter
                value={amount}
                displayType="text"
                thousandSeparator=","
                decimalSeparator="."
                prefix="Rs. "
              />
            </Text>
          </Stack>
        </Group>

        {status === "success" ? (
          <Group gap={3}>
            <FaCheckCircle size={16} color="green" />
            <Text size="xs" c="dimmed">
              Success
            </Text>
          </Group>
        ) : (
          <Group gap={3}>
            <FaCheckCircle size={16} color="red" />
            <Text size="xs" c="dimmed">
              Pending
            </Text>
          </Group>
        )}
      </Group>
    </Paper>
  );
}

export default PaymentRow;
