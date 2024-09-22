"use client";

import { ReactNode, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import LoadingScreen from "../Reusable/LoadingScreen";

export default function AuthChecker({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || isAuthenticated === null) {
    return <LoadingScreen/>
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}
