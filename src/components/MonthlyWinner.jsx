import { Group, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getWinners } from "../utils/databaseHelper";
import PageLoader from "./PageLoader";
import PaymentRow from "./PaymentRow";

function MonthlyWinner({ committee_id }) {
  const { data: winners, isLoading } = useQuery({
    queryKey: ["winners", committee_id],
    queryFn: () => getWinners(committee_id),
    enabled: !!committee_id,
  });
  if (isLoading) return <PageLoader></PageLoader>;
  if (!winners?.length)
    return (
      <Stack>
        <Text size="sm" c="dimmed" fw={700}>
          There are no Winners yet
        </Text>
      </Stack>
    );
  return (
    <Stack>
      {winners?.map((winner) => (
        <Group key={winner?.id}>
          <Text size="lg" c="dimmed" fw={700}>
            {" "}
            {winner.round_number}
          </Text>
          <PaymentRow
            name={winner?.user_profiles?.full_name}
            amount={winner?.amount}
            url={winner?.user_profiles?.avatar_url}
          />{" "}
          <Text size="xs" c="orange" ml="auto" fw={700}>
            {winner?.won_on}
          </Text>
        </Group>
      ))}
    </Stack>
  );
}

export default MonthlyWinner;
