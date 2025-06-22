import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";

import classes from "./features.module.css";

import { FaHandsHelping, FaLock, FaUsers } from "react-icons/fa";

const feature = [
  {
    title: "Streamlined Committee Management",
    description:
      "Easily create and manage your chit fund group, track members, contributions, and payout schedules — all from one dashboard.",
    icon: FaUsers,
  },
  {
    title: "Secure & Private",
    description:
      "We don’t share your data with third parties. All transactions and member records are stored securely and visible only to authorized users.",
    icon: FaLock,
  },
  {
    title: "No Middlemen",
    description:
      "Connect directly with your members. All payments go straight to the organizer’s UPI — no hidden charges or commissions.",
    icon: FaHandsHelping,
  },
];

export default function Features() {
  const theme = useMantineTheme();
  const features = feature.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <feature.icon size={50} stroke={1.5} color={theme.primaryColor} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge variant="filled" size="lg">
          Community-first Savings
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Everything you need to run a digital chit fund
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Build trust with your group. Track payments, manage withdrawals, and
        stay on top of your finances with a single tool built for savings
        communities.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
