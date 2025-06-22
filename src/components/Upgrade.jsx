import { Button, Image, Text, Title } from "@mantine/core";
import image from "../assets/upgrade.svg";
import classes from "./upgrade.module.css";

export default function Upgrade() {
  return (
    <div className={classes.wrapper}>
  <div className={classes.body}>
    <Title className={classes.title}>Wait a minute...</Title>
    <Text fw={500} fz="lg" mb={5}>
      Want to start your own chit fund group?
    </Text>
    <Text fz="sm" c="dimmed">
      As an organizer, you’ll have full control — invite members, track payments, verify UPI uploads, and manage monthly withdrawals. It’s simple, secure, and fully digital.
    </Text>

    <div className={classes.controls}>
      <Button radius="md" size="md" onClick={() => navigate('/organizer/create-committee')}>
        Become an Organizer
      </Button>
    </div>
  </div>
  <Image src={image} className={classes.image} />
</div>

  );
}
