import {
  Button,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommittee } from "../utils/databaseHelper";
function CreateCommittee({ org_id }) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: "",
      org_id,
      daily_contribution: 50,
      total_months: 12,
      total_members: 4,
    },
    validate: {
      name: (value) =>
        value.length < 3
          ? "Name must be at least 3 characters"
          : value.length > 20
          ? "Name must be at most 20 characters"
          : null,
      description: (value) =>
        value.length < 10
          ? "Description must be at least 10 characters"
          : value.length > 100
          ? "Description must be at most 100 characters"
          : null,
      daily_contribution: (value) =>
        value < 50
          ? "Daily contribution must be at least 50"
          : value > 500
          ? "Daily contribution must be at most 500"
          : null,
      total_months: (value, values) =>
        value < 1
          ? "Total months must be at least 1"
          : value > 24
          ? "Total months must be at most 24"
          : value % values.total_members !== 0
          ? "Total months must be divisible by total members, So that each member has same number of withdrawals"
          : null,
      total_members: (value, values) =>
        value < 2
          ? "Total members must be at least 2"
          : value > 12
          ? "Total members must be at most 12"
          : values.total_months % value !== 0
          ? "Total months must be divisible by total members, So that each member has same number of withdrawals"
          : null,
    },
    validateInputOnChange: [
      "name",
      "description",
      "total_members",
      "daily_contribution",
      "total_months",
    ],
  });
  const queryClient = useQueryClient();
  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (values) =>
      await createCommittee({ org_id: org_id, ...values }),
    onSuccess: () => {
      queryClient.refetchQueries(["committee"]);
    },
  });
  return (
    <Stack>
      <Paper p={"md"} withBorder shadow="md">
        <Text pb={"sm"} fw={500} c="dimmed">
          Create Committee
        </Text>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack>
            <TextInput
              label="Committee Name"
              placeholder="Enter committee name"
              withAsterisk
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Description"
              placeholder="Enter description"
              withAsterisk
              {...form.getInputProps("description")}
            />
            <NumberInput
              label="Daily Contribution"
              withAsterisk
              {...form.getInputProps("daily_contribution")}
            />
            <NumberInput
              label="Total Months"
              withAsterisk
              {...form.getInputProps("total_months")}
            />
            <NumberInput
              label="Total Members"
              placeholder="Enter total members"
              withAsterisk
              {...form.getInputProps("total_members")}
            />
            <NumberInput
              label="Total Amount (Auto Calculated)"
              readOnly
              styles={{
                input: {
                  color: "gray",
                },
              }}
              value={
                form.values.daily_contribution *
                form.values.total_months *
                30 *
                form.values.total_members
              }
            />
            <NumberInput
              label="Total Amount per Month (Auto Calculated)"
              readOnly
              styles={{
                input: {
                  color: "gray",
                },
              }}
              value={
                form.values.daily_contribution * form.values.total_members * 30
              }
            />

            <Button type="submit" fullWidth loading={isPending}>
              Submit
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export default CreateCommittee;
