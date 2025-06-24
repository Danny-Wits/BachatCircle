import { notifications } from "@mantine/notifications";
import supabase from "./supabase";

export const checkAdmin = async (id) => {
  let { data: Admins, error } = await supabase
    .from("Admins")
    .select("*")
    .eq("id", id);
  if (error) console.log(error);
  return Admins.length > 0;
};

export const getOrganizers = async () => {
  let { data: organizers, error } = await supabase
    .from("organizers")
    .select("*");
  if (error) console.log(error);
  return organizers;
};

export const verifyOrganizer = async (id) => {
  let { error } = await supabase.rpc("verify_organizer", {
    org_id: id,
  });
  if (error)
    notifications.show({
      title: "Error",
      message: error.message,
      color: "red",
    });
  else {
    notifications.show({
      title: "Success",
      message: "Organizer verified successfully",
      color: "green",
    });
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
