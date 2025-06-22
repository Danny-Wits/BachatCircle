import {
  AppShell,
  Box,
  Burger,
  Button,
  Divider,
  Group,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CiLogout } from "react-icons/ci";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Upgrade from "./components/upgrade";
import useSupabase from "./utils/supabaseHook";
export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  const { logout } = useSupabase();
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
            <Group ml="xl" gap={0} visibleFrom="sm">
              <Button onClick={logout} leftSection={<CiLogout />}>
                Log Out
              </Button>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <div>Mobile Nav</div>
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
