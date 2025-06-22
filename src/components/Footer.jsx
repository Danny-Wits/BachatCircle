import { Anchor, Container, Group, Title } from "@mantine/core";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import classes from "./footer.module.css";

const links = [
  { link: "#", label: "Contact" },
  { link: "#", label: "Privacy" },
  { link: "#", label: "Blog" },
  { link: "#", label: "Careers" },
];

export default function Footer() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group gap={3}>
          <RiMoneyRupeeCircleFill
            size={32}
            color="var(--mantine-primary-color-7)"
          />
          <Title order={4}>Bachat Cirle</Title>
        </Group>

        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
