import { Center } from "@mantine/core";
import Auth from "./Auth";
import Home from "./Home";
import useSupabase from "./utils/supabaseHook";
function App() {
  const { isAuthenticated } = useSupabase();

  if (!isAuthenticated)
    return (
      <Center h="100vh">
        <Auth />
      </Center>
    );

  return <Home></Home>;
}

export default App;
