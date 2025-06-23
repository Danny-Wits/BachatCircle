import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { RiAdminLine, RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Upgrade from "./components/Upgrade";
import { checkAdmin } from "./utils/databaseHelper";
import useSupabase from "./utils/supabaseHook";
export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  const { logout, user } = useSupabase();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>{Header(opened, toggle, user, logout)}</AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {MobileNav(user, logout)}
      </AppShell.Navbar>

      <AppShell.Main>
        <Hero></Hero>
        <Divider p={"md"}></Divider>
        <Features></Features>
        <Box p={"lg"}>
          <Upgrade></Upgrade>
        </Box>
        <Footer></Footer>
      </AppShell.Main>
    </AppShell>
  );
}
export function Header(opened, toggle, user, logout) {
  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group justify="space-between" style={{ flex: 1 }}>
        <Group gap={2} justify="center" align="center">
          <RiMoneyRupeeCircleFill
            size={32}
            color="var(--mantine-primary-color-7)"
          />
          <Title order={3}>Bachat Cirle</Title>
        </Group>
        <Group ml="xl" gap={10} visibleFrom="sm">
          <Avatar
            src={user?.user_metadata?.avatar_url}
            radius="xl"
            name={user?.user_metadata?.name || "Anonymous"}
            color="initials"
          ></Avatar>
          <AdminButton user={user}></AdminButton>
          <Button size="sm" onClick={logout} leftSection={<CiLogout />}>
            Log Out
          </Button>
        </Group>
      </Group>
    </Group>
  );
}
export function AdminButton({ user }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    (async () => {
      setIsAdmin(await checkAdmin(user?.id));
    })();
  }, []);
  if (!isAdmin) return <></>;
  return (
    <Button
      onClick={() => navigate("/admin")}
      size="sm"
      variant="outline"
      leftSection={<RiAdminLine />}
    >
      Admin
    </Button>
  );
}

export function MobileNav(user, logout) {
  return (
    <Stack h={"100%"}>
      <Stack mt={"auto"}>
        <Group>
          <Avatar
            src={user?.user_metadata?.avatar_url}
            radius="xl"
            name={user?.user_metadata?.name || "Anonymous"}
            color="initials"
          ></Avatar>
          <Text c={"dimmed"}>{user?.user_metadata?.name || "Anonymous"}</Text>
        </Group>
        <AdminButton user={user}></AdminButton>
        <Button fullWidth onClick={logout} leftSection={<CiLogout />}>
          Log Out
        </Button>
      </Stack>
    </Stack>
  );
}
