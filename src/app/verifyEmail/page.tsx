"use client";
import { api } from "@/axios";
import Spinner from "@/components/Reusable/Spinner";
import { updateUser } from "@/redux/mainSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { PiWarningCircle } from "react-icons/pi";

const page = () => {
  const user = useAppSelector((state) => state.main.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  if (!user) router.push("/auth/login");
  if (user.isConfirmed) router.push(`/${user.role}`);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      const form = new FormData(e.currentTarget);
      const code = form.get("code");
      await api.post("/auth/verify-email", { code, userId: user.id });
      dispatch(updateUser({ ...user, isConfirmed: true }));
      router.push(`/${user.role}`);
    } catch (error: any) {
      setError(error.response.data.errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1 flex flex-col items-center _container w-full">
      <div className="pt-32 flex flex-col gap-6 flex-1 w-full max-w-md">
        <h2 className="text-4xl font-bold">Verify Email</h2>
        <p className="text-sm">
          if <span className="text-bluePrimary">{user.email}</span> is valid, a
          verification code has been sent. Please enter the code to complete
          your registration.
        </p>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {error && (
            <p className="bg-darkSecondary p-3 rounded-md flex items-center gap-2 shadow-xl">
              <PiWarningCircle className="size-6 text-red-500" /> {error}
            </p>
          )}
          <input
            maxLength={5}
            name="code"
            type="numeric"
            placeholder="Enter Code"
            className="border-b border-darkSecondary pb-2 bg-transparent w-full outline-none"
            required
          />
          <button
            type="submit"
            className="bg-bluePrimary hover:bg-blueSecondary focus:ring-2 focus:outline-none focus:ring-goldPrimary rounded-full w-full py-2.5 text-center font-bold"
          >
            {isLoading ? <Spinner /> : "Verify"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default page;
