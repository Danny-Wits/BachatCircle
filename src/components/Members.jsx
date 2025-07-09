import { Stack } from "@mantine/core";
import Member from "./Member";

function Members({ members }) {
  const userProfiles = members?.map((member) => member.user_profiles);
  return (
    <Stack>
      {userProfiles?.map((profile, index) => (
        <Member key={index} user={profile} />
      ))}
    </Stack>
  );
}

export default Members;
