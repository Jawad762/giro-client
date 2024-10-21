"use client";
import { api } from "@/axios";
import Dropdown from "@/components/Reusable/Dropdowns/ProfileDropdown";
import LoadingScreen from "@/components/Reusable/LoadingScreen";
import Toast from "@/components/Reusable/Toast";
import { carColors, carManufacturers } from "@/constants";
import { uploadImageToFirebase } from "@/helpers";
import { updateUser } from "@/redux/mainSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { UserType, VehicleInfo } from "@/types";
import React, { useState } from "react";
import { MdPhotoCamera } from "react-icons/md";

const Profile = () => {
  const user = useAppSelector((state) => state.main.user) as UserType;
  const vehicleInfo = useAppSelector(
    (state) => state.main.vehicleInfo
  ) as VehicleInfo;

  const [editingProfile, setEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [info, setInfo] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture,
    vehicle: {
      type: vehicleInfo.type,
      color: vehicleInfo.color,
      licenseNumber: vehicleInfo.licenseNumber,
    },
  });

  const dispatch = useAppDispatch();

  const saveChanges = async () => {
    try {
      setIsLoading(true);

      if (
        Object.values(info).find((e) => e === null || e === undefined) ||
        Object.values(info.vehicle).find((e) => e === null || e === undefined)
      ) {
        throw new Error()
      }

      await api.put("/users/edit", info);

      dispatch(
        updateUser({
          ...user,
          ...info,
        })
      );

      setEditingProfile(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveChanges(); 
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true)
      const file = e.target.files?.[0]
      if (!file) return
      const downloadUrl = await uploadImageToFirebase(file) as string
      setInfo((prev) => ({ ...prev, profilePicture: downloadUrl }))
    } catch (error) {
      console.error(error)
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <section className="flex-1 flex flex-col _container w-full">
        <div className="pt-24 lg:pt-28 space-y-10">
          <div className="flex items-center justify-between flex-wrap gap-5">
            <p className="text-5xl">
              {editingProfile ? "Editing Profile" : "Profile"}
            </p>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="bg-white text-black rounded-lg py-2 px-6"
              >
                Edit Profile
              </button>
            )}
            {editingProfile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingProfile(false)}
                  className="py-2 px-6"
                >
                  Cancel
                </button>
                <button
                  type="submit" 
                  form="profile-form"
                  className="bg-bluePrimary rounded-lg py-2 px-6"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="relative w-fit  flex-shrink-0">
              <img
                src={info.profilePicture}
                className="rounded-full object-cover size-24"
              />
              {editingProfile && (
                <div className="absolute inset-0 grid place-items-center bg-black/50 rounded-full">
                  <label htmlFor="picture"><MdPhotoCamera className="size-8 cursor-pointer"/></label>
                  <input id="picture" name="picture" type="file" accept="image/*" onChange={handlePictureChange} className="hidden sr-only"/>
                </div>
              )}
            </div>
            <form
              id="profile-form" 
              className="flex flex-col gap-6 w-full"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-1 w-full max-w-xl">
                <label>First Name</label>
                <input
                  className="py-2 px-4 rounded-full bg-transparent border disabled:border-darkSecondary border-white focus:outline-none focus:border-none focus:ring-1 focus:ring-bluePrimary"
                  defaultValue={info.firstName}
                  disabled={!editingProfile}
                  onChange={(e) =>
                    setInfo((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  minLength={2}
                  maxLength={30}
                  required
                />
              </div>

              <div className="flex flex-col gap-1 w-full max-w-xl">
                <label>Last Name</label>
                <input
                  className="py-2 px-4 rounded-full bg-transparent border disabled:border-darkSecondary border-white focus:outline-none focus:border-none focus:ring-1 focus:ring-bluePrimary"
                  defaultValue={info.lastName}
                  disabled={!editingProfile}
                  onChange={(e) =>
                    setInfo((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  minLength={2}
                  maxLength={30}
                  required
                />
              </div>

              <Dropdown
                label="Vehicle Type"
                value={info.vehicle.type}
                options={carManufacturers}
                onSelect={(type: string) =>
                  setInfo((prev) => ({
                    ...prev,
                    vehicle: { ...info.vehicle, type },
                  }))
                }
                condition={editingProfile}
              />

              <Dropdown
                label="Vehicle Color"
                value={info.vehicle.color}
                options={carColors}
                onSelect={(color: string) =>
                  setInfo((prev) => ({
                    ...prev,
                    vehicle: { ...info.vehicle, color },
                  }))
                }
                condition={editingProfile}
              />

              <div className="flex flex-col gap-1 w-full max-w-xl">
                <label>License Number</label>
                <input
                  className="py-2 px-4 rounded-full bg-transparent border disabled:border-darkSecondary border-white focus:outline-none focus:border-none focus:ring-1 focus:ring-bluePrimary"
                  defaultValue={vehicleInfo.licenseNumber || ""}
                  disabled={!editingProfile}
                  onChange={(e) =>
                    setInfo((prev) => ({
                      ...prev,
                      vehicle: {
                        ...info.vehicle,
                        licenseNumber: e.target.value,
                      },
                    }))
                  }
                  minLength={2}
                  maxLength={30}
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      {isLoading && (
        <section className="fixed inset-0">
          <LoadingScreen semiTransparent />
        </section>
      )}

      <Toast showToast={isSuccess} status="success" text="Profile updated successfully." />
      <Toast showToast={isError} status="error" text="Something went wrong." />
    </>
  );
};

export default Profile;
