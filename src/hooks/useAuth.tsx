"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { api } from "@/axios";

export const nonProtectedRoutes = ["/auth/login", "/auth/register", "/verifyCode"];

const useAuth = () => {
  const jwt = useAppSelector((state) => state.main.jwt);
  const user = useAppSelector((state) => state.main.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      if (nonProtectedRoutes.includes(pathname)) {
        setIsAuthenticated(true);
      } else if (!jwt || !user) {
        setIsAuthenticated(false);
      } else {
        if (!isAuthenticated) {
          await api.get("/helloworld");
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return { isAuthenticated, loading, user };
};

export default useAuth;
