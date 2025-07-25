import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { FaStarOfLife } from "react-icons/fa";
import supabase from "./utils/supabase";
import useSupabase from "./utils/supabaseHook";

export default function Auth({ email = "", isInvite = false }) {
  const [type, toggle] = useToggle(["login", "register"]);
  useEffect(() => {
    if (isInvite) toggle("register");
  }, [isInvite]);

  const form = useForm({
    initialValues: {
      email: email || "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });
  const { login, loginWithGoogle, invite } = useSupabase();
  const handleSubmit = (values) => {
    if (isInvite) handleInvite();

    if (type === "register") {
      if (!values.terms) {
        notifications.show({
          title: "Error",
          message: "Please accept terms and conditions",
          color: "red",
        });
        return;
      }
      handleRegister(values);
    } else {
      handleLogin(values);
    }
  };
  const handleLogin = async (values) => {
    const { error } = await login(values.email, values.password);
    if (error) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
      return;
    }
  };
  const handleRegister = async (values) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name,
        },
      },
    });
    if (error) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
      return;
    }
    notifications.show({
      title: "Success",
      message: "Check your email for the login link!",
      color: "green",
    });
  };
  const handleAuthProvider = async () => {
    const { error } = await loginWithGoogle();
    if (error) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    }
  };

  const handleInvite = async () => {};
  return (
    <Paper radius="md" p="lg" withBorder>
      <Text size="lg" fw={500}>
        Welcome to{" "}
        <span style={{ color: "var(--mantine-primary-color-7)" }}>
          Bachat Circle
        </span>
        , {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton onClick={handleAuthProvider}>Google</GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
      {isInvite && (
        <Text c="dimmed" size="xs" p={"md"}>
          <FaStarOfLife color="orange" /> You are invited by{" "}
          <b>{invite?.inviter}</b> to join <b>{invite?.committee}</b> committee
        </Text>
      )}
    </Paper>
  );
}
function GoogleIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 262"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      />
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}
export function GoogleButton(props) {
  return <Button leftSection={<GoogleIcon />} variant="default" {...props} />;
}
