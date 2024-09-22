"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { api } from "@/axios";

const nonProtectedRoutes = ["/auth/login", "/auth/register"];

const useAuth = () => {
  const { jwt, user } = useAppSelector((state) => state.main);
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
        await api.get("/helloworld");
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

  return { isAuthenticated, loading };
};

export default useAuth;
