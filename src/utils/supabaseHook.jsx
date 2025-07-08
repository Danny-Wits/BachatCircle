import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "./supabase";

const SupabaseContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [invite, setInvite] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Subscribe to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        queryClient.refetchQueries(["auth"]);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  //Helper functions
  const loginWithGoogle = async () =>
    await supabase.auth.signInWithOAuth({ provider: "google" });
  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setLoading(false);
  };

  return (
    <SupabaseContext.Provider
      value={{
        session,
        user: session?.user || null,
        isAuthenticated: session !== null,
        loginWithGoogle,
        login,
        logout,
        setInvite,
        invite,
        isLoading,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export default function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a AuthProvider");
  }
  return context;
}
