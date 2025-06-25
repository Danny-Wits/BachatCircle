import { Button, Paper, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import WebFrame from "../WebFrame";
import { addOrganizer } from "../utils/databaseHelper";
import useSupabase from "../utils/supabaseHook";

// id
// uuid	uuid

// created_at
// timestamp with time zone	timestamptz

// name
// text	text

// email
// text	text

// phone
// text	text

// location
// text	text

// is_verified
// boolean	bool

// committee_id
// uuid	uuid

function BecomeOrganizer() {
  const { user } = useSupabase();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
    validate: {
      name: (val) =>
        val.length < 2 ? "Name must have at least 4 letters" : null,
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      phone: (val) => (val && val?.length < 10 ? "Invalid phone number" : null),
      location: (val) => (val?.length < 2 ? "Invalid location" : null),
    },
    validateInputOnChange: ["email", "phone", "location"],
  });
  useEffect(() => {
    form.setValues({
      name: user?.user_metadata?.name,
      email: user?.email,
      phone: user?.phone_no,
    });
  }, []);
  const { mutate, isPending } = useMutation({
    mutationFn: async (values) => await addOrganizer(values),
  });
  return (
    <WebFrame>
      <Paper radius={"md"} shadow="lg" p={"md"}>
        <Title order={2}>Become an Organizer</Title>
        <form
          onSubmit={form.onSubmit((values) =>
            mutate({ id: user?.id, ...values })
          )}
        >
          <Stack p={"sm"}>
            <TextInput
              label="Real Name"
              placeholder="John Wick"
              {...form.getInputProps("name")}
              withAsterisk
            />
            <TextInput
              label="Email"
              placeholder="something@gmail.com"
              style={{ pointerEvents: "none" }}
              {...form.getInputProps("email")}
              disabled
              readOnly
            />
            <TextInput
              label="Phone Number"
              placeholder="1234567890"
              {...form.getInputProps("phone")}
              withAsterisk
            />
            <TextInput
              label="Location"
              placeholder="Doda"
              {...form.getInputProps("location")}
              withAsterisk
            />
            <Button type="submit" loading={isPending}>
              Apply to be an Organizer
            </Button>
          </Stack>
        </form>
      </Paper>
    </WebFrame>
  );
}

export default BecomeOrganizer;
