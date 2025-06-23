import useSupabase from "../utils/supabaseHook";

function OrganizerDashboard() {
  const { user, logout } = useSupabase();
  return (
    <div>
      <h1>Organizer Dashboard</h1>
      <p>{user?.user_metadata?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default OrganizerDashboard;
