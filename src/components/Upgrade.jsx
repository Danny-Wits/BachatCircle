import { Button, Image, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import image from "../assets/upgrade.svg";
import { routes } from "../utils/routes";
import useSupabase from "../utils/supabaseHook";
import classes from "./upgrade.module.css";
import { checkOrganizer } from "../utils/databaseHelper";

export default function Upgrade() {
  const navigate = useNavigate();
  const { user } = useSupabase();
  const { data: isOrganizer, isLoading } = useQuery({
    queryKey: ["organizer"],
    queryFn: () => checkOrganizer(user?.id),
  });
  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title className={classes.title}>Wait a minute...</Title>
        <Text fw={500} fz="lg" mb={5}>
          Want to start your own chit fund group?
        </Text>
        <Text fz="sm" c="dimmed">
          As an organizer, you’ll have full control — invite members, track
          payments, verify UPI uploads, and manage monthly withdrawals. It’s
          simple, secure, and fully digital.
        </Text>

        <div className={classes.controls}>
          <Button
            radius="md"
            size="md"
            onClick={() =>
              navigate(
                isOrganizer ? routes.OrganizerDashboard : routes.BecomeOrganizer
              )
            }
            loading={isLoading}
          >
            Become an Organizer
          </Button>
        </div>
      </div>
      <Image src={image} className={classes.image} />
    </div>
  );
}
