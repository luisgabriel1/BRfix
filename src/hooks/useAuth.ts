import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("useAuth - Starting initialization");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("useAuth - Auth state changed:", event, "session:", !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin role after setting session
        if (session?.user) {
          console.log("useAuth - Checking admin role for user:", session.user.id);
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          
          console.log("useAuth - Admin check result:", !!data);
          setIsAdmin(!!data);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
        console.log("useAuth - Finished processing auth change");
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("useAuth - Initial session check:", !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log("useAuth - Checking admin role for existing session:", session.user.id);
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        console.log("useAuth - Admin check result (initial):", !!data);
        setIsAdmin(!!data);
      }
      setLoading(false);
      console.log("useAuth - Finished initial session check");
    });

    return () => subscription.unsubscribe();
  }, []);


  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signOut,
  };
};