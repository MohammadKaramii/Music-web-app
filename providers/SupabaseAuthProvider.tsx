"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { User } from "@supabase/supabase-js";
import useAuthModal from "@/hooks/useAuthModal";

interface SupabaseAuthContextType {
  user: User | null;
  loading: boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  loading: true,
});

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export default function SupabaseAuthProvider({
  children,
}: SupabaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setLoggedIn, setName } = useAuthModal();

  useEffect(() => {

    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        setLoggedIn(true);
        setName(session.user.user_metadata?.full_name || "");
      } else {
        setUser(null);
        setLoggedIn(false);
        setName("");
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setLoggedIn(true);
        setName(session.user.user_metadata?.full_name || "");
      } else {
        setUser(null);
        setLoggedIn(false);
        setName("");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setLoggedIn, setName]);

  return (
    <SupabaseAuthContext.Provider value={{ user, loading }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}
