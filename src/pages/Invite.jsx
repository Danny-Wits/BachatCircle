import { Center, Stack, Text } from "@mantine/core";
import { useParams } from "react-router";

function Invite() {
  const params = useParams();
  const token = params?.token;
  if (!token) {
    return (
      <Center h="100vh">
        <Text>Invalid Token</Text>
      </Center>
    );
  }
  const email = mailFromToken(token);
  return (
    <Center h="100vh" bd={"10px solid var(--mantine-color-orange-3)"}>
      <Stack align="center" spacing="xl" p={"xl"}>
        <Text align="center">
          Hey there{" "}
          <span
            style={{
              fontWeight: "bold",
              color: "var(--mantine-primary-color-7)",
            }}
          >
            {email}
          </span>{" "}
          ! We have received your request to join a Bachat Circle.
        </Text>
        <Text align="center">
          We are currently working on this feature. We will reach out to you at
          once it is ready.
        </Text>
      </Stack>
    </Center>
  );
}

export default Invite;

function mailFromToken(token) {
  return token.substring(10, token.length);
}
