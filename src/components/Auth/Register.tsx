"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../../../public/logo-notext.png";
import Link from "next/link";
import axios from "axios";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft } from "react-icons/md";
import Spinner from "../Reusable/Spinner";
import { useAppDispatch } from "@/redux/store";
import { updateJwt, updateUser, updateVehicleInfo } from "@/redux/mainSlice";
import { useRouter } from "next/navigation";
import { PiWarningCircle } from "react-icons/pi";
import { API_URL, carColors, carManufacturers } from "@/constants";
import { VehicleInfo } from "@/types";

const Register = () => {
  const [role, setRole] = useState("rider");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    type: null,
    color: null,
    licenseNumber: null
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError(null);
      setIsLoading(true);
      if (role === 'driver' && Object.values(vehicleInfo).some(value => value === null)) {
        setError("Please fill in all the vehicle details");
        setIsLoading(false);
        return;
      }
      
      const form = new FormData(e.currentTarget);
      const email = form.get("email");
      const password = form.get("password");
      const firstName = form.get("first_name");
      const lastName = form.get("last_name");

      console.log({
        email,
        password,
        firstName,
        lastName,
        role,
        vehicle: role === 'driver' ? vehicleInfo: null
      })

      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        firstName,
        lastName,
        role,
        vehicle: role === 'driver' ? vehicleInfo: null
      });

      dispatch(updateUser({...data.user, profilePicture: data.user.profilePicture ? data.user.profilePicture : '/pfp-placeholder.png'}));
      dispatch(updateJwt(data.jwt));
      // vehicleInfo will return null for riders
      dispatch(updateVehicleInfo(data.vehicle));

      router.push(`/verifyEmail`);
    } catch (error: any) {
      console.error(error);
      setError(error.response.data.errorMessage);
    } finally {
      setIsLoading(false);
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

      <div className="flex-1 py-4 w-full max-w-lg mx-auto space-y-6">
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
          {error && (
            <p className="bg-darkSecondary p-3 rounded-md flex items-center gap-2 shadow-xl">
              <PiWarningCircle className="size-6 text-red-500" /> {error}
            </p>
          )}
          <div className="mb-5 flex items-center gap-4">
            <input
              id="first_name"
              name="first_name"
              minLength={2}
              maxLength={30}
              className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-1/2 p-3.5"
              placeholder="First Name"
              required
            />
            <input
              id="last_name"
              name="last_name"
              minLength={2}
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
              minLength={6}
              maxLength={30}
              className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-full p-3.5"
              required
            />
          </div>
          {role === "driver" && (
            <>
              <div className="mb-5 flex items-center gap-4">
                <div
                  tabIndex={0}
                  className="relative group w-1/2 cursor-pointer"
                >
                  <div
                    tabIndex={0}
                    className="flex items-center justify-between gap-2 bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary w-full p-3.5"
                  >
                    <input
                      id="vehicle-type"
                      name="vehicle-type"
                      placeholder="Vehicle Type"
                      defaultValue={
                        vehicleInfo.type ? vehicleInfo.type : ""
                      }
                      className="bg-transparent outline-none w-full"
                      required
                      disabled
                    />
                    <MdKeyboardArrowDown className="h-4 w-4" />
                  </div>
                  <ul className="bg-darkSecondary shadow-md z-10 rounded-lg inset-x-0 hidden group-focus-within:block absolute -bottom-1 translate-y-full max-h-48 overflow-y-auto">
                    {carManufacturers.map((car) => (
                      <li
                        key={car}
                        onClick={() =>
                          setVehicleInfo((prev) => ({
                            ...prev,
                            type: car,
                          }))
                        }
                        className="p-2 hover:bg-darkPrimary cursor-pointer border-b last:border-0 last:rounded-b-lg first:rounded-t-lg"
                      >
                        <p className="line-clamp-1 text-sm">{car}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  tabIndex={0}
                  className="relative group w-1/2 cursor-pointer"
                >
                  <div
                    tabIndex={0}
                    className="flex items-center justify-between gap-2 bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary w-full p-3.5"
                  >
                    <input
                      id="vehicle-color"
                      name="vehicle-color"
                      placeholder="Vehicle Color"
                      defaultValue={
                        vehicleInfo.color ? vehicleInfo.color : ""
                      }
                      className="bg-transparent outline-none w-full"
                      required
                      disabled
                    />
                    <MdKeyboardArrowDown className="h-4 w-4" />
                  </div>
                  <ul className="bg-darkSecondary shadow-md z-10 rounded-lg inset-x-0 hidden group-focus-within:block absolute -bottom-1 translate-y-full max-h-48 overflow-y-auto">
                    {carColors.map((color) => (
                      <li
                        key={color}
                        onClick={() =>
                          setVehicleInfo((prev) => ({
                            ...prev,
                            color: color,
                          }))
                        }
                        className="p-2 hover:bg-darkPrimary cursor-pointer border-b last:border-0 last:rounded-b-lg first:rounded-t-lg"
                      >
                        <p className="line-clamp-1 text-sm">{color}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mb-5">
                <input
                  id="license-number"
                  name="license-number"
                  placeholder="License Plate Number"
                  onChange={(e) =>
                    setVehicleInfo((prev) => ({
                      ...prev,
                      licenseNumber: e.target.value,
                    }))
                  }
                  minLength={2}
                  maxLength={30}
                  className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-full p-3.5"
                  required
                />
              </div>
            </>
          )}
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
