import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  NavLink as MantineNavLink,
  Paper,
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
import {
  RiAdminLine,
  RiGroupLine,
  RiHomeHeartLine,
  RiInbox2Fill,
  RiMoneyRupeeCircleFill,
} from "react-icons/ri";
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
          <Group gap={10} px={"sm"} mr="auto">
            {LinksToPages.map((link) => (
              <MantineNavLink
                display={"flex"}
                flex={0}
                key={link.label}
                active={link.link === window.location.pathname}
                label={link.label}
                leftSection={link.icon}
                onClick={() => navigate(link.link)}
              ></MantineNavLink>
            ))}
          </Group>
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
  const navigate = useNavigate();
  return (
    <Stack h={"100%"}>
      <Title order={3}>Useful Link</Title>
      <Stack gap={10} px={"sm"}>
        {LinksToPages.map((link) => (
          <MantineNavLink
            key={link.label}
            active={link.link === window.location.pathname}
            label={link.label}
            leftSection={link.icon}
            onClick={() => navigate(link.link)}
          ></MantineNavLink>
        ))}
      </Stack>
      <Paper withBorder mt={"auto"} radius="md" p="sm" shadow="md">
        <Stack gap={10} p={"sm"}>
          {" "}
          <Group mb={"md"}>
            <Avatar
              src={user?.user_metadata?.avatar_url}
              radius="xl"
              name={user?.user_metadata?.name || "Anonymous"}
              color="initials"
            ></Avatar>
            <Stack gap={0}>
              <Text c={"dimmed"} fw={600} size="sm">
                {user?.user_metadata?.name || "Anonymous"}
              </Text>
              <Text c={"dimmed"} size="xs">
                {user?.email}{" "}
              </Text>
            </Stack>
          </Group>
          <AdminButton user={user}></AdminButton>
          <Button fullWidth onClick={logout} leftSection={<CiLogout />}>
            Log Out
          </Button>{" "}
        </Stack>{" "}
      </Paper>
    </Stack>
  );
}
const LinksToPages = [
  {
    label: "Home",
    icon: <RiHomeHeartLine />,
    link: routes.Home,
  },
  {
    label: "Members",
    icon: <RiGroupLine />,
    link: routes.MembersDashboard,
  },
  {
    label: "Invites",
    icon: <RiInbox2Fill />,
    link: routes.InviteAccept,
  },
];
