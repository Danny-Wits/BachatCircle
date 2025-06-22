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
import { CiLogout } from "react-icons/ci";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Upgrade from "./components/Upgrade";
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
      <AppShell.Header>
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
              <Button size="sm" onClick={logout} leftSection={<CiLogout />}>
                Log Out
              </Button>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Stack h={"100%"}>
          <Stack mt={"auto"}>
            <Group>
              <Avatar
                src={user?.user_metadata?.avatar_url}
                radius="xl"
                name={user?.user_metadata?.name || "Anonymous"}
                color="initials"
              ></Avatar>
              <Text c={"dimmed"}>
                {user?.user_metadata?.name || "Anonymous"}
              </Text>
            </Group>

            <Button fullWidth onClick={logout} leftSection={<CiLogout />}>
              Log Out
            </Button>
          </Stack>
        </Stack>
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
