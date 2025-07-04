import { ActionIcon, Box, Divider } from "@mantine/core";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Upgrade from "./components/Upgrade";
import WebFrame from "./WebFrame";
export default function Home() {
  return (
    <WebFrame>
      <Hero></Hero>
      <Divider p={"md"}></Divider>
      <Features></Features>
      <Box p={"lg"}>
        <Upgrade></Upgrade>
      </Box>
      <Footer></Footer>
    </WebFrame>
  );
}
export const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <ActionIcon color="gray" variant="light" onClick={() => navigate("/")}>
      <IoIosArrowBack />
    </ActionIcon>
  );
};
