"use client";

import { ReactNode, useEffect } from "react";
import useAuth, { nonProtectedRoutes } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import LoadingScreen from "../Reusable/LoadingScreen";

export default function AuthChecker({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user && !user.isConfirmed && !nonProtectedRoutes.includes(pathname)) {
      router.push("/verifyEmail");
    }
    else if (!loading && !isAuthenticated) {
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
