"use client";

import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";

interface AuthLoadingWrapperProps {
  children: React.ReactNode;
}

export default function AuthLoadingWrapper({
  children,
}: AuthLoadingWrapperProps) {
  const { loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return <>{children}</>;
}
