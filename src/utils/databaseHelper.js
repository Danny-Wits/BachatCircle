import { notifications } from "@mantine/notifications";
import supabase from "./supabase";

//!Admin
export const checkAdmin = async (id) => {
  let { data: Admins, error } = await supabase
    .from("Admins")
    .select("*")
    .eq("id", id);
  if (error) showError(error);
  return Admins.length > 0;
};

//!Organizers
export const checkOrganizer = async (id) => {
  let { data, error } = await supabase.rpc("checkOrganizer", {
    org_id: id,
  });
  if (error) {
    showError(error);
    return false;
  }
  if (!data) {
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

//!invites
export const getInvites = async (
  email,
  committee = false,
  filter_used = false
) => {
  let query = supabase.from("invites").select("*").eq("email", email);

  if (committee) query = query.eq("committee_id", committee);
  if (filter_used) query = query.eq("used", false);
  query.order("created_at", { ascending: false });
  const { data: invites, error } = await query;

  if (error) showError(error);

  return invites;
};
export const validateInvite = async (token, email) => {
  let { data, error } = await supabase.rpc("verify_invite", {
    p_token: token,
    p_email: email,
  });
  if (error) showError(error);
  notifications.show({
    title: "Success",
    message: "Invite validated successfully",
    color: "green",
  });
  return data;
};
export const createInvite = async (invite) => {
  const invites = await getInvites(invite?.email, invite?.committee_id, true);

  if (invites?.length > 0) return { token: invites[0].token };
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
export const acceptInvite = async (id) => {
  let { data, error } = await supabase.rpc("accept_invite", {
    invite_id: id,
  });
  if (error) showError(error);
  return data;
};

//!Committee
export const getCommittee = async (id) => {
  let { data: committee, error } = await supabase
    .from("committee")
    .select("*")
    .eq("org_id", id);
  if (error) showError(error);
  return committee;
};
export const isCommitteeOrganizer = async (com_id) => {
  let { data, error } = await supabase.rpc("is_org_user", {
    com_id,
  });
  if (error) showError(error);
  return data;
};
export const getCommitteesForMember = async (id) => {
  let { data: committee, error } = await supabase
    .from("committee_members")
    .select("* , committee(*)")
    .eq("user_id", id);
  if (error) showError(error);
  return committee;
};
export const getCommitteeForUser = async (id) => {
  let { data: committee, error } = await supabase
    .from("committee")
    .select("*")
    .eq("id", id);
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

export const getCommitteeMembers = async (id) => {
  let { data: members, error } = await supabase
    .from("committee_members")
    .select("* , user_profiles(*)")
    .eq("committee_id", id)
    .order("id", { ascending: false });
  if (error) showError(error);
  return members;
};

export const startCommittee = async (id) => {
  const { error } = await supabase.rpc("try_start_committee", {
    comm_id: id,
  });
  if (error) showError(error);
};
//!Payments
export const getCommitteePaymentsOnDate = async (id, payment_data) => {
  let { data: payments, error } = await supabase
    .from("expected_payments")
    .select("*, user_profiles(*)")
    .eq("committee_id", id)
    .eq("payment_date", payment_data);
  if (error) showError(error);
  return payments;
};
export const verifyPayment = async (id) => {
  let { error } = await supabase.rpc("verify_payment", {
    payment_id: id,
  });
  if (error) showError(error);
};
export const getPendingPaymentsForMembers = async (id, onlyToday) => {
  let { data, error } = await supabase.rpc("get_pending_payments", {
    comm_id: id,
    only_today: onlyToday,
  });
  if (error) showError(error);
  return data;
};
export const todaysContribution = async (id) => {
  let { data, error } = await supabase.rpc("contribution_summary_today", {
    comm_id: id,
  });
  if (error) showError(error);
  return data;
};
export async function uploadPaymentProof({
  file,
  committee_id,
  member_id,
  id,
}) {
  const { data: payment } = await supabase
    .from("expected_payments")
    .select("status")
    .eq("id", id);
  if (!payment || payment[0]?.status !== "pending") {
    showError({ message: "Already uploaded proof" });
    return;
  }
  const fileExt = file.name.split(".").pop();
  const filePath = `committee/${committee_id}/${member_id}/${id}-${Date.now()}.${fileExt}`;

  // Upload the file to the bucket
  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    showError(uploadError);
  }

  const { error: updateError } = await supabase
    .from("expected_payments")
    .update({
      proof_url: filePath,
      status: "uploaded",
      paid_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    showError(updateError);
  }

  return {
    filePath,
  };
}

export const getImageUrl = async (id) => {
  const { data: payment } = await supabase
    .from("expected_payments")
    .select("proof_url")
    .eq("id", id);
  const url = payment[0]?.proof_url;
  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(url, 60 * 60);
  if (error) showError(error);
  return data.signedUrl;
};
//!Extras
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
  throw new Error(error.message);
};
export const createToken = async (email, invitedBy, committee) => {
  const token =
    Math.random().toString(36).substring(0, 10) +
    "|" +
    email +
    "|" +
    invitedBy +
    "|" +
    committee;
  return token.toString();
};
export const getBaseURL = () =>
  `${window.location.protocol}//${window.location.host}`;
