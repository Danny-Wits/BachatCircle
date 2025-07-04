import { notifications } from "@mantine/notifications";
import supabase from "./supabase";

export const checkAdmin = async (id) => {
  let { data: Admins, error } = await supabase
    .from("Admins")
    .select("*")
    .eq("id", id);
  if (error) showError(error);
  return Admins.length > 0;
};
export const checkOrganizer = async (id) => {
  let { data, error } = await supabase.rpc("checkOrganizer", {
    org_id: id,
  });
  if (error) {
    showError(error);
    return false;
  }
  if (!data) {
    notifications.show({
      title: "Error",
      message: "You are not an organizer",
      color: "red",
    });
    return false;
  }
  return true;
};
export const getOrganizers = async () => {
  let { data: organizers, error } = await supabase
    .from("organizers")
    .select("*");
  if (error) showError(error);
  return organizers;
};

export const addOrganizer = async ({ id, name, email, phone, location }) => {
  const { error } = await supabase
    .from("organizers")
    .insert([{ id, name, email, phone, location }]);
  if (error)
    showError({
      message:
        "Request to become an organizer failed , Common reason is that you are already an organizer",
    });
  else {
    notifications.show({
      title: "Success",
      message: "Request to become an organizer sent successfully",
      color: "green",
    });
  }
};
export const verifyOrganizer = async (id) => {
  let { error } = await supabase.rpc("verify_organizer", {
    org_id: id,
  });
  if (error) showError(error);
  else {
    notifications.show({
      title: "Success",
      message: "Organizer verified successfully",
      color: "green",
    });
  }
};

export const getCommittee = async (id) => {
  let { data: committee, error } = await supabase
    .from("committee")
    .select("*")
    .eq("org_id", id);
  if (error) showError(error);
  return committee;
};

export const createCommittee = async (committee) => {
  const { error } = await supabase.from("committee").insert([committee]);
  if (error) showError({ message: "Committee creation failed" });
  else {
    notifications.show({
      title: "Success",
      message: "Committee created successfully",
      color: "green",
    });
  }
};

export const createInvite = async (invite) => {
  const { error } = await supabase.from("invites").insert([invite]);
  if (error) {
    showError({ message: "Invite creation failed" });
    return { token: null };
  } else {
    notifications.show({
      title: "Success",
      message: "Invite created successfully",
      color: "green",
    });
    return { token: invite.token };
  }
};

export function timeAgo(isoTime) {
  const diff = Math.floor((Date.now() - new Date(isoTime)) / 1000);
  const [s, m, h, d] = [60, 3600, 86400, 604800];

  if (diff < s) return "just now";
  if (diff < m) return `${Math.floor(diff / s)}m ago`;
  if (diff < h) return `${Math.floor(diff / m)}h ago`;
  if (diff < d) return `${Math.floor(diff / h)}d ago`;
  return `${Math.floor(diff / d)}w ago`;
}
const showError = (error) => {
  notifications.show({
    title: "Error",
    message: error.message,
    color: "red",
  });
};

export const createToken = async (email) => {
  const token = Math.random().toString(36).substring(2, 15) + email;
  return token.toString();
};
export const getBaseURL = () =>
  `${window.location.protocol}//${window.location.host}`;
