import supabase from "./supabase";

export const checkAdmin = async (id) => {
  let { data: Admins, error } = await supabase
    .from("Admins")
    .select("*")
    .eq("id", id);
  if (error) console.log(error);
  return Admins.length > 0;
};
