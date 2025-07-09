import { Group, Title } from "@mantine/core";
import { HomeButton } from "../Home";

function PageTitle({ title }) {
  return (
    <Group align="center" py={"sm"}>
      <HomeButton></HomeButton>
      <Title order={2}>{title}</Title>
      
    </Group>
  );
}

export default PageTitle;
