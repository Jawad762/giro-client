"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../../../public/logo-notext.png";
import Link from "next/link";
import axios from "axios";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Spinner from "../Reusable/Spinner";
import { useAppDispatch } from "@/redux/store";
import { updateJwt, updateUser } from "@/redux/mainSlice";
import { useRouter } from "next/navigation";
import { PiWarningCircle } from "react-icons/pi";
import { API_URL } from "@/constants";

const Register = () => {
  const [role, setRole] = useState("rider");
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setError(null)
      setIsLoading(true)
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const email = form.get("email");
      const password = form.get("password");
      const firstName = form.get("first_name");
      const lastName = form.get("last_name");

      const { data } = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          email,
          password,
          firstName,
          lastName,
          role,
        }
      );

      dispatch(updateUser(data.user))
      dispatch(updateJwt(data.jwt))

      router.push(`/verifyEmail`);
    } catch (error: any) {
      console.error(error);
      setError(error.response.data.errorMessage)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <section className="space-y-6 w-full xl:w-[60%] bg-darkPrimary py-4 px-4 sm:px-8 flex flex-col">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center">
          <MdKeyboardArrowLeft className="h-6 w-6" />
          Back
        </button>
        <Image src={logo} alt="logo" height={50} width={50} />
      </div>

      <div className="flex-1 pt-4 w-full max-w-lg mx-auto space-y-6">
        <form onSubmit={handleRegister} className="space-y-5">
          <h2 className="text-4xl font-bold leading-snug">
            Register as{" "}
            <span className="text-bluePrimary capitalize">{role} </span>
            <button
              type="button"
              onClick={() => setRole(role === "rider" ? "driver" : "rider")}
              className="text-darkSecondary capitalize"
            >
              / {role === "rider" ? "driver" : "rider"}
            </button>
          </h2>
          {error && <p className="bg-darkSecondary p-3 rounded-md flex items-center gap-2 shadow-xl"><PiWarningCircle className="size-6 text-red-500"/> {error}</p>}
          <div className="mb-5 flex items-center gap-4">
            <input
              id="first_name"
              name="first_name"
              maxLength={30}
              className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-1/2 p-3.5"
              placeholder="First Name"
              required
            />
            <input
              id="last_name"
              name="last_name"
              maxLength={30}
              className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-1/2 p-3.5"
              placeholder="Last Name"
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="email"
              id="email"
              name="email"
              className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-full p-3.5"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-full p-3.5"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-bluePrimary hover:bg-blueSecondary focus:ring-2 focus:outline-none focus:ring-goldPrimary rounded-full w-full py-2.5 text-center font-bold"
          >
            {isLoading ? <Spinner /> : "Submit"}
          </button>
        </form>

        <div className="border-t border-darkSecondary pt-6 relative">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[53%] bg-darkPrimary px-2 inline-block">
            OR
          </span>
          <Link
            href={"login"}
            className="block bg-white text-black focus:ring-2 focus:outline-none focus:ring-white rounded-full w-full py-2.5 text-center font-bold"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
