import {
  ActionIcon,
  Badge,
  Button,
  CheckIcon,
  Code,
  CopyButton,
  Divider,
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
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import {
  createInvite,
  createToken,
  getBaseURL,
  startCommittee,
  timeAgo,
} from "../utils/databaseHelper";
import useSupabase from "../utils/supabaseHook";
import Members from "./Members";
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
  const queryClient = useQueryClient();
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
  const isFull = members?.length == committee?.total_members;
  const { mutate: start, isPending: isPendingStart } = useMutation({
    mutationKey: ["startCommittee"],
    mutationFn: async () => await startCommittee(committee.id),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Committee started successfully",
        color: "green",
      });
      queryClient.refetchQueries(["committee"]);
    },
  });
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
          <Group>
            <Title order={2}>{committee?.name}</Title>
            <Badge color="green">{committee?.status}</Badge>
          </Group>
          <Text c="dimmed" size="xs">
            {committee?.description}
          </Text>
          <Text c="dimmed" size="xs">
            Created {timeAgo(committee?.created_at)}
          </Text>
        </Stack>
      </Paper>
      <TitleCard title="Actions">
        <Group>
          {committee?.status === "active" ? (
            <Badge color="green"> Committee has Started</Badge>
          ) : (
            <>
              <Button
                loading={isPendingStart}
                disabled={!isFull}
                fullWidth
                onClick={() => {
                  start();
                }}
              >
                {!isFull ? (
                  <Badge color="red" variant="dot">
                    {" "}
                    Committee is Not Full
                  </Badge>
                ) : (
                  <Text>
                    {" "}
                    {isPendingStart ? "Starting..." : "Start Committee"}{" "}
                  </Text>
                )}
              </Button>
              <Button variant="light" onClick={open} fullWidth>
                Generate Invite Link
              </Button>
            </>
          )}
        </Group>
      </TitleCard>

      <TitleCard title="Stats">
        <StatsProgress data={fillData(committee, members)}></StatsProgress>
      </TitleCard>

      <TitleCard title="Members">
        <Members members={members}></Members>
      </TitleCard>

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

function TitleCard({ title, children }) {
  return (
    <Paper withBorder radius="md" p="xs">
      <Text fw={600} size="sm">
        {title}
      </Text>
      <Divider mb="md" mt="xs"></Divider>
      {children}
    </Paper>
  );
}
