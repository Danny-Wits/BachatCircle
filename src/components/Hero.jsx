import {
  Button,
  CheckIcon,
  Container,
  Group,
  Image,
  List,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import image from "../assets/hero.svg";
import { checkOrganizer } from "../utils/databaseHelper";
import { routes } from "../utils/routes";
import classes from "./hero.module.css";

export default function Hero({ user }) {
  const navigate = useNavigate();
  const { data: isOrganizer, isLoading } = useQuery({
    queryKey: ["organizer"],
    queryFn: () => checkOrganizer(user?.id),
  });
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Online <span className={classes.highlight}>Chit Fund</span>{" "}
            management
          </Title>
          <Text c="dimmed" mt="md">
            Manage your monthly chit committees with ease. Invite members, track
            payments, verify transactions, and handle withdrawals — all from a
            single dashboard.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <CheckIcon size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>One-click member invites</b> – share invite links securely with
              potential members
            </List.Item>
            <List.Item>
              <b>UPI-based payments</b> – users upload payment proof directly
              from their UPI app
            </List.Item>
            <List.Item>
              <b>Manual verification</b> – organizers verify transactions before
              monthly disbursal
            </List.Item>
          </List>
          {isOrganizer ? (
            <Group mt={30}>
              <Button
                onClick={() => navigate("/organizer")}
                size="sm"
                radius="xl"
                className={classes.control}
              >
                <span className={classes.controlText}>Go to Dashboard</span>
              </Button>
            </Group>
          ) : (
            <Group mt={30}>
              <Button
                onClick={() => navigate(routes.BecomeOrganizer)}
                size="sm"
                radius="xl"
                className={classes.control}
              >
                <span className={classes.controlText}>Get Started</span>
              </Button>

              <Button
                variant="default"
                radius="xl"
                size="sm"
                className={classes.control}
                onClick={() => navigate(routes.MembersDashboard)}
              >
                <span className={classes.controlText}>Committees</span>
              </Button>
            </Group>
          )}
        </div>
        <Image src={image} className={classes.image} />
      </div>
    </Container>
  );
}
