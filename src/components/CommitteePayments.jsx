import {
  ActionIcon,
  Affix,
  Center,
  Dialog,
  Divider,
  Group,
  Indicator,
  Loader,
  Notification,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { Navigate, useNavigate, useParams } from "react-router";
import {
  getCommitteeForUser,
  getCommitteePaymentsOnDate,
  isCommitteeOrganizer,
} from "../utils/databaseHelper";
import useSupabase from "../utils/supabaseHook";
import WebFrame from "../WebFrame";
import PageLoader from "./PageLoader";
import PaymentRow from "./PaymentRow";
function CommitteePayments() {
  const id = useParams()?.id;
  const { user } = useSupabase();
  const navigate = useNavigate();
  const [isOrgView, setIsOrgView] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["committee", id],
    queryFn: () => getCommitteeForUser(id),
    enabled: !!id,
  });
  const { data: isOrg, isLoading: isLoadingOrg } = useQuery({
    queryKey: ["isOrg"],
    queryFn: () => isCommitteeOrganizer(id),
    enabled: !!id,
  });
  const [date, setDate] = useState(new Date());

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments", id, date],
    queryFn: () => getCommitteePaymentsOnDate(id, new Date(date).toISOString()),
  });
  const [opened, { toggle, close }] = useDisclosure(true);

  if (isLoading) return <PageLoader></PageLoader>;
  const committee = data[0];
  const paymentDate = dayjs(committee?.started_on).add(
    30 * committee?.current_round,
    "day"
  );
  const dayRenderer = (date) => {
    const day = dayjs(date).date();
    return (
      <Indicator
        size={6}
        color="red"
        offset={-5}
        disabled={!dayjs(date).isSame(paymentDate)}
      >
        <div>{day}</div>
      </Indicator>
    );
  };
  if (committee?.status === "ready")
    return (
      <WebFrame>
        <Stack>
          <Head />
          <Notification
            withBorder
            color="red"
            radius="md"
            title={committee?.name}
            withCloseButton={false}
          >
            Committee had not started yet. Please ask your organizer to start
            the Committee
          </Notification>
        </Stack>
      </WebFrame>
    );
  if (isLoadingOrg) return <PageLoader></PageLoader>;
  if (isOrgView && !isOrg) return <Navigate to="/"></Navigate>;
  return (
    <WebFrame>
      {" "}
      <Stack>
        <Head />
        <Dialog
          opened={opened}
          withCloseButton
          onClose={close}
          size="lg"
          radius="md"
        >
          <Text c="dimmed" size="xs" pb="xs">
            Select the payment date
          </Text>
          <Center>
            <DatePicker
              renderDay={dayRenderer}
              value={date}
              onChange={setDate}
              minDate={dayjs(committee?.started_on)}
              maxDate={new Date(committee?.started_on).setDate(
                committee?.total_months * 30
              )}
            />
          </Center>
        </Dialog>
        {!opened && (
          <Affix position={{ bottom: 30, right: 20 }}>
            <ActionIcon onClick={toggle} size="xl" radius="xl">
              <CiCalendar size={24} />
            </ActionIcon>
          </Affix>
        )}
        <Paper withBorder radius="md" p="xs" mt="md" shadow="md" h="100%">
          {" "}
          {isLoadingPayments ? (
            <Center>
              <Loader></Loader>
            </Center>
          ) : (
            <Stack p={"xs"}>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Title order={4}>Committee Payments</Title>
                  <Text>on {new Date(date).toDateString()}</Text>
                </Stack>
                {isOrg && (
                  <SegmentedControl
                    radius={"xl"}
                    value={isOrgView ? "true" : "false"}
                    transitionDuration={200}
                    data={[
                      { label: "Members", value: "false" },
                      { label: "Organizer", value: "true" },
                    ]}
                    onChange={(value) => setIsOrgView(value === "true")}
                    color="orange"
                  ></SegmentedControl>
                )}
              </Group>
              {!isOrgView ? UserView() : OrgView()}
            </Stack>
          )}
        </Paper>
      </Stack>
    </WebFrame>
  );

  function UserView() {
    return (
      <Stack>
        <Text size="xs" c="dimmed">
          You
        </Text>
        {payments
          ?.filter((payment) => payment?.member_id === user?.id)
          ?.map((payment) => (
            <PaymentRow
              key={payment?.id}
              name={payment?.user_profiles?.full_name}
              url={payment?.user_profiles?.avatar_url}
              amount={payment?.expected_amount}
              status={payment?.status}
              isPayment={true}
              meta={payment}
            ></PaymentRow>
          ))}
        <Divider></Divider>
        <Text size="xs" c="dimmed">
          Others
        </Text>
        {payments
          ?.filter((payment) => payment?.member_id !== user?.id)
          ?.map((payment) => (
            <PaymentRow
              key={payment?.id}
              name={payment?.user_profiles?.full_name}
              url={payment?.user_profiles?.avatar_url}
              amount={payment?.expected_amount}
              status={payment?.status}
            ></PaymentRow>
          ))}
      </Stack>
    );
  }
  function OrgView() {
    return (
      <Stack>
        {payments?.map((payment) => (
          <PaymentRow
            key={payment?.id}
            name={payment?.user_profiles?.full_name}
            url={payment?.user_profiles?.avatar_url}
            amount={payment?.expected_amount}
            status={payment?.status}
            isOrg={true}
            meta={payment}
          ></PaymentRow>
        ))}
      </Stack>
    );
  }
}

export default CommitteePayments;
const Head = () => {
  const navigate = useNavigate();
  return (
    <Group>
      {" "}
      <ActionIcon onClick={() => navigate(-1)}>
        {" "}
        <IoIosArrowBack />
      </ActionIcon>
      <Title order={3}>Committee Payments</Title>
    </Group>
  );
};
