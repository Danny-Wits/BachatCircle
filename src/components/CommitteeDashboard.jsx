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
  SegmentedControl,
  Spoiler,
  Stack,
  Text,
  TextInput,
  Title,
  TooltipFloating,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import {
  createInvite,
  createToken,
  getBaseURL,
  getPendingPaymentsForMembers,
  startCommittee,
  timeAgo,
  todaysContribution,
} from "../utils/databaseHelper";
import useSupabase from "../utils/supabaseHook";
import Members from "./Members";
import PaymentRow from "./PaymentRow";
import StatsProgress from "./ProgressSection";

function CommitteeDashboard({ committee, members }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useSupabase();
  const [onlyToday, setOnlyToday] = useState(true);
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
      setInviteToken(encodeURIComponent(token));
    },
  });
  const { data: pendingPayments, isPending: isPendingPayments } = useQuery({
    queryKey: ["pendingPayments", onlyToday],
    queryFn: () => getPendingPaymentsForMembers(committee?.id, onlyToday),
  });

  const { data: contribution } = useQuery({
    queryKey: ["todaysContribution"],
    queryFn: () => todaysContribution(committee?.id),
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
  const clipboard = useClipboard();
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
                <Code c={"blue"} style={{ userSelect: "text" }}>
                  {inviteLink}
                </Code>
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
        <Stack spacing="xs" gap={4}>
          <Group>
            <Title order={2}>{committee?.name}</Title>
            <Badge color="green">{committee?.status}</Badge>
          </Group>
          <Text c="dimmed" size="xs">
            {committee?.description}
          </Text>
          <Text c="dimmed" size="xs">
            UPI ID:{" "}
            <span
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                clipboard.copy(committee?.upi_id);
                notifications.show({
                  title: "Copied to clipboard",
                  color: "green",
                });
              }}
            >
              {committee?.upi_id}
            </span>{" "}
          </Text>
          <Text c="dimmed" size="xs">
            Created {timeAgo(committee?.created_at)}
          </Text>
          <Text c="dimmed" size="xs">
            {committee?.started_on &&
              `Started on ${new Date(committee?.started_on).toDateString()}`}
          </Text>
        </Stack>
      </Paper>
      <TitleCard title="Actions" visible={committee?.status === "ready"}>
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
        <StatsProgress
          data={fillData(committee, members, contribution)}
        ></StatsProgress>
      </TitleCard>
      <TitleCard
        title="Pending Payments"
        visible={committee?.status === "active"}
      >
        <Stack>
          <SegmentedControl
            color="orange"
            transitionDuration={500}
            value={onlyToday ? "Today" : "Total"}
            data={["Today", "Total"]}
            onChange={(value) => setOnlyToday(value === "Today")}
          ></SegmentedControl>
          {pendingPayments?.length === 0 ||
            (isPendingPayments ? (
              <Text c="dimmed" size="xs">
                No pending payments
              </Text>
            ) : (
              <PendingPayments payments={pendingPayments}></PendingPayments>
            ))}
        </Stack>
      </TitleCard>
      <TitleCard title="Members">
        <Spoiler hideLabel="Hide" showLabel="Show more" maxHeight={160}>
          <Members members={members}></Members>
        </Spoiler>
      </TitleCard>

      {/* <Code w={300}>{JSON.stringify(committee, null, 2)}</Code> */}
    </Stack>
  );
}

export default CommitteeDashboard;

function fillData(committee, members, contribution) {
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
      label: "Daily Contribution",
      stats: "Rs. " + contribution?.current + "/" + contribution?.required,
      progress: (100 * contribution?.current) / contribution?.required,
      color: "red",
      icon: "money",
    },
    {
      label: "Total Months",
      stats: committee.current_round + "/" + committee.total_months + " months",
      progress: (100 * committee.current_round) / committee.total_months,
      color: "blue",
      icon: "months",
    },
  ];
}

function TitleCard({ title, children, visible = true }) {
  return (
    <>
      {visible && (
        <>
          <Paper withBorder radius="md" p="xs">
            <Text fw={600} size="sm">
              {title}
            </Text>
            <Divider mb="md" mt="xs"></Divider>
            {children}
          </Paper>
        </>
      )}
    </>
  );
}

function PendingPayments({ payments }) {
  return (
    <Spoiler hideLabel="Hide" showLabel="Show more" maxHeight={260}>
      <Stack>
        {payments?.map((payment, index) => (
          <PaymentRow
            key={index}
            name={payment?.name}
            url={payment?.avatar_url}
            amount={payment?.pending}
          ></PaymentRow>
        ))}
      </Stack>
    </Spoiler>
  );
}
