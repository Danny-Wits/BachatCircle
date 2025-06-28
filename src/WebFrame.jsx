import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { FaMoon, FaSun } from "react-icons/fa";
import { RiAdminLine, RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router";
import { checkAdmin } from "./utils/databaseHelper";
import { routes } from "./utils/routes";
import useSupabase from "./utils/supabaseHook";
export default function WebFrame({ children }) {
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

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
export function Header(opened, toggle, user, logout) {
  const navigate = useNavigate();
  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group justify="space-between" style={{ flex: 1 }}>
        <Group
          gap={2}
          justify="center"
          align="center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(routes.Home)}
        >
          <RiMoneyRupeeCircleFill
            size={32}
            color="var(--mantine-primary-color-7)"
          />
          <Title order={3}>Bachat Cirle</Title>
        </Group>
        <ThemeChangeButton></ThemeChangeButton>
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
export function ThemeChangeButton() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  return (
    <ActionIcon
      mr={"auto"}
      variant="light"
      onClick={() =>
        setColorScheme(computedColorScheme === "dark" ? "light" : "dark")
      }
    >
      {computedColorScheme === "dark" ? <FaMoon></FaMoon> : <FaSun></FaSun>}
    </ActionIcon>
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
      onClick={() => navigate(routes.AdminDashboard)}
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
