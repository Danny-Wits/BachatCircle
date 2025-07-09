import { Center, useComputedColorScheme } from "@mantine/core";
import Auth from "./Auth";
import Home from "./Home";
import useSupabase from "./utils/supabaseHook";
function App() {
  const { isAuthenticated, invite } = useSupabase();
  const computedColorScheme = useComputedColorScheme();
  if (!isAuthenticated)
    return (
      <Center
        h="100vh"
        style={{
          background: `linear-gradient(45deg, #FFA500 45%, ${
            computedColorScheme === "dark" ? "#333" : "#fff"
          } 45%)`,
          backgroundSize: "120% 120%",
          animation: "wave-gradient 6s ease-in-out infinite",
        }}
      >
        <style>
          {`
      @keyframes wave-gradient {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}
        </style>

        <Auth email={invite?.email || ""} isInvite={invite !== null} />
      </Center>
    );

  return <Home />;
}

export default App;
