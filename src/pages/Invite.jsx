import { Center, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import PageLoader from "../components/PageLoader";
import { validateInvite } from "../utils/databaseHelper";
import { routes } from "../utils/routes";
import useSupabase from "../utils/supabaseHook";

function Invite() {
  const params = useParams();
  const token = params?.token;
  const { setInvite } = useSupabase();

  const { data, isLoading } = useQuery({
    queryKey: ["invite"],
    queryFn: () => validateInvite(token, breakToken(token)[1]),
    staleTime: Infinity,
    gcTime: 0,
  });
  if (!token) {
    return (
      <Center h="100vh">
        <Text>Invalid Token or Token has expired</Text>
      </Center>
    );
  }
  const [_, email, inviter, committee] = breakToken(token);
  useEffect(() => {
    if (data) {
      setInvite({ id: data, token, email, inviter, committee });
    }
  }, [data]);
  if (isLoading) return <PageLoader></PageLoader>;

  return <Navigate to={routes.Home}></Navigate>;
}

export default Invite;

function breakToken(token) {
  return token.split("|");
}
