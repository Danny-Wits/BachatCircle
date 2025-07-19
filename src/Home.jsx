import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Notification,
  Stack,
  Text,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Upgrade from "./components/Upgrade";
import { acceptInvite, getInvites } from "./utils/databaseHelper";
import { routes } from "./utils/routes";
import useSupabase from "./utils/supabaseHook";
import WebFrame from "./WebFrame";
export default function Home() {
  const [opened, { close }] = useDisclosure(true);
  const { user, invite, setInvite } = useSupabase();
  const navigate = useNavigate();
  const { data: invites, isLoading } = useQuery({
    queryKey: ["invites"],
    queryFn: () => getInvites(user?.email, false, true),
    enabled: !!user?.email,
  });
  const showInvite = (invite || invites?.length > 0) && !isLoading && opened;
  const handleAcceptInvite = async () => {
    let data;
    if (invite) data = await acceptInvite(invite.id);
    if (data) {
      notifications.show({
        title: "Success",
        message: "Invite accepted successfully",
        color: "green",
      });
      setInvite(null);
    }
  };
  return (
    <WebFrame>
      {showInvite && (
        <Notification
          onClose={close}
          withBorder
          color="teal"
          radius="lg"
          title="Invite"
        >
          <Stack>
            <Text>
              You have pending invite
              {invite ? ` from ${invite.inviter}` : "s"}
            </Text>

            <Group>
              {invite && (
                <Button size="xs" color="teal" onClick={handleAcceptInvite}>
                  Accept now
                </Button>
              )}
              {invites?.length > 0 && (
                <Button
                  size="xs"
                  color="teal"
                  variant="outline"
                  onClick={() => navigate(routes.InviteAccept)}
                >
                  Go to Invites Page
                </Button>
              )}
            </Group>
          </Stack>
        </Notification>
      )}
      <Hero user={user}></Hero>
      <Divider p={"md"}></Divider>
      <Features></Features>
      <Box p={"lg"}>
        <Upgrade></Upgrade>
      </Box>
      <Footer></Footer>
    </WebFrame>
  );
}
export const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <ActionIcon color="gray" variant="light" onClick={() => navigate("/")}>
      <IoIosArrowBack />
    </ActionIcon>
  );
};
