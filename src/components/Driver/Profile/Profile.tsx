"use client";
import { updateUser } from "@/redux/mainSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { UserType } from "@/types";
import React, { useState } from "react";

const Profile = () => {
  const user = useAppSelector((state) => state.main.user) as UserType;
  const [editingProfile, setEditingProfile] = useState(false)
  const [info, setInfo] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture
  })
  const dispatch = useAppDispatch()

  const saveChanges = () => {
    if (Object.values(info).find(e => e === null || e === undefined)) return

    dispatch(updateUser({
      ...user,
      ...info
    }))
  }

  return (
    <section className="flex-1 flex flex-col _container w-full">
      <div className="pt-24 lg:pt-28 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-5xl">{editingProfile ? 'Editing Profile' : 'Profile'}</p>
          {!editingProfile && <button onClick={() => setEditingProfile(true)} className="bg-white text-black rounded-lg py-2 px-6">Edit Profile</button>}
          {editingProfile && (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingProfile(false)} className="py-2 px-6">Cancel</button>
              <button onClick={() => setEditingProfile(false)} className="bg-bluePrimary rounded-lg py-2 px-6">Save Changes</button>
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <img
            src="/pfp-placeholder.png"
            height={100}
            width={100}
            className="rounded-full object-cover"
          />
          <form className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <label>First Name</label>
              <input
                className="py-2 px-4 rounded-full bg-transparent border disabled:border-darkSecondary border-white focus:outline-none focus:border-none focus:ring-1 focus:ring-bluePrimary"
                defaultValue={user.firstName}
                disabled={!editingProfile}
                onChange={(e) => setInfo(prev => ({...prev, firstName: e.target.value}))}
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <label>Last Name</label>
              <input
                className="py-2 px-4 rounded-full bg-transparent border disabled:border-darkSecondary border-white focus:outline-none focus:border-none focus:ring-1 focus:ring-bluePrimary"
                defaultValue={user.lastName}
                disabled={!editingProfile}
                onChange={(e) => setInfo(prev => ({...prev, lastName: e.target.value}))}
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <label>Car</label>
              <input
                className="py-2 px-4 rounded-full bg-transparent border disabled:border-darkSecondary border-white focus:outline-none focus:border-none focus:ring-1 focus:ring-bluePrimary"
                defaultValue={''}
                disabled={!editingProfile}
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <label>Car Color</label>
              <input
                className="py-2 px-4 rounded-full bg-transparent border disabled:border-darkSecondary border-white focus:outline-none focus:border-none focus:ring-1 focus:ring-bluePrimary"
                defaultValue={''}
                disabled={!editingProfile}
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <label>License Number</label>
              <input
                className="py-2 px-4 rounded-full bg-transparent border disabled:border-darkSecondary border-white focus:outline-none focus:border-none focus:ring-1 focus:ring-bluePrimary"
                defaultValue={''}
                disabled={!editingProfile}
                required
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
