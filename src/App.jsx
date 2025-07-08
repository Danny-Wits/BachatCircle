import { Center } from "@mantine/core";
import Auth from "./Auth";
import Home from "./Home";
import useSupabase from "./utils/supabaseHook";
function App() {
  const { isAuthenticated, invite } = useSupabase();
  if (!isAuthenticated)
    return (
      <Center h="100vh">
        <Auth email={invite?.email || ""} isInvite={invite !== null} />
      </Center>
    );

  return <Home />;
}

export default App;
