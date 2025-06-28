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
      monthly_contribution: 1000,
      total_months: 12,
      max_members: 5,
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
      monthly_contribution: (value) =>
        value < 100
          ? "Monthly contribution must be at least 100"
          : value > 10000
          ? "Monthly contribution must be at most 10000"
          : null,
      total_months: (value) =>
        value < 1
          ? "Total months must be at least 1"
          : value > 24
          ? "Total months must be at most 24"
          : null,
      max_members: (value) =>
        value < 2
          ? "Max members must be at least 2"
          : value > 12
          ? "Max members must be at most 12"
          : null,
    },
    validateInputOnChange: [
      "name",
      "description",
      "max_members",
      "monthly_contribution",
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
              label="Monthly Contribution"
              placeholder="Enter monthly contribution"
              withAsterisk
              {...form.getInputProps("monthly_contribution")}
            />
            <NumberInput
              label="Total Months"
              placeholder="Enter total months"
              withAsterisk
              {...form.getInputProps("total_months")}
            />
            <NumberInput
              label="Max Members"
              placeholder="Enter max members"
              withAsterisk
              {...form.getInputProps("max_members")}
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
