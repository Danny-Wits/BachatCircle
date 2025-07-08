import {
  ActionIcon,
  Button,
  CheckIcon,
  Code,
  CopyButton,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  TooltipFloating,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { createInvite, createToken, getBaseURL } from "../utils/databaseHelper";
import useSupabase from "../utils/supabaseHook";
import StatsProgress from "./ProgressSection";

function CommitteeDashboard({ committee, members }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useSupabase();
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
    validateInputOnChange: ["email"],
  });
  const [inviteToken, setInviteToken] = useState("");
  const { mutate, isPending } = useMutation({
    mutationKey: ["createInvite"],
    mutationFn: async (values) => await createInvite(values),
    onSuccess: (data) => {
      const { token } = data;
      setInviteToken(token);
    },
  });

  const handleGenerateInvite = async (values) => {
    const token = await createToken(
      form?.values?.email,
      user?.user_metadata?.name,
      committee?.name
    );
    mutate({ token: token, committee_id: committee.id, ...values });
  };
  const inviteLink = `${getBaseURL()}/invite/${inviteToken}`;
  return (
    <Stack p={"md"}>
      <Modal opened={opened} onClose={close} title="Committee Invite Link">
        <form onSubmit={form.onSubmit(handleGenerateInvite)}>
          <Stack>
            <TextInput
              placeholder="Enter the users email"
              label="Email"
              {...form.getInputProps("email")}
            />
            {!!inviteToken && (
              <Group>
                <Text size="sm" fw={500}>
                  Invite Link
                </Text>
                <CopyButton value={inviteLink} timeout={2000}>
                  {({ copied, copy }) => (
                    <TooltipFloating
                      label={copied ? "Copied" : "Copy"}
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        variant="subtle"
                        onClick={copy}
                      >
                        {copied ? (
                          <CheckIcon size={16} />
                        ) : (
                          <FaCopy size={16} />
                        )}
                      </ActionIcon>
                    </TooltipFloating>
                  )}
                </CopyButton>
                <Code c={"blue"}>{inviteLink}</Code>
                <Button fullWidth onClick={() => setInviteToken("")}>
                  Clear
                </Button>
              </Group>
            )}

            {!inviteToken && (
              <Button type="submit" loading={isPending}>
                Generate Invite
              </Button>
            )}
          </Stack>
        </form>
      </Modal>
      <Paper withBorder radius="md" p="xs">
        <Stack>
          <Title order={2}>{committee?.name}</Title>
          <Text c="dimmed" size="xs">
            {committee?.description}
          </Text>
        </Stack>
      </Paper>

      <StatsProgress data={fillData(committee, members)}></StatsProgress>
      <Button variant="light" onClick={open}>
        Generate User Invite URL
      </Button>
      {/* <Code w={300}>{JSON.stringify(committee, null, 2)}</Code> */}
    </Stack>
  );
}

export default CommitteeDashboard;

function fillData(committee, members) {
  const currentMembers = members?.length || 0;
  return [
    {
      label: "Total Members Joined",
      stats: currentMembers + "/" + committee.total_members + " members",
      progress: (currentMembers * 100) / committee.total_members,
      color: "teal",
      icon: "members",
    },
    {
      label: "Total Months",
      stats: committee.current_round + "/" + committee.total_months + " months",
      progress: (100 * committee.current_round) / committee.total_months,
      color: "blue",
      icon: "months",
    },
    {
      label: "Daily Contribution",
      stats: "Rs. " + committee.daily_contribution,
      progress: 0,
      color: "red",
      icon: "money",
    },
  ];
}
