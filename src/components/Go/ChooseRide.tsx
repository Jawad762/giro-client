"use client";
import Image from "next/image";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RideInfo } from "../Reusable/Map";

const ChooseRide = ({ rideInfo }: { rideInfo: RideInfo }) => {
  const [chosenRide, setChosenRide] = useState("affordable")
  const [showOptions, setShowOptions] = useState(true)

  const cost = 2 + (rideInfo.distance / 2000) + ((rideInfo.duration / 60) * 0.1)

  const now = new Date()
  let currentHours = now.getHours()
  const currentMinutes = now.getMinutes()

  const isPM = currentHours >= 12
  currentHours = currentHours % 12 || 12 

  const rideTimeInMinutes = Math.floor(rideInfo.duration / 60)

  let finalMinutes = currentMinutes + rideTimeInMinutes
  let finalHours = currentHours

  if (finalMinutes >= 60) {
    finalHours += Math.floor(finalMinutes / 60)
    finalMinutes = finalMinutes % 60
  }

  finalHours = finalHours % 12 || 12

  const finalPeriod = isPM && finalHours >= currentHours ? "PM" : "AM"

  return (
    <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%]">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">Choose a Ride</h2>
        <button className="md:hidden" onClick={() => setShowOptions(!showOptions)}>
          <MdKeyboardArrowDown className="h-8 w-8" />
        </button>
      </div>
      <div
        className={`space-y-4 duration-500 transition-[max-height] ${
          showOptions ? "max-md:max-h-screen" : "max-md:max-h-0 max-md:overflow-hidden"
        }`}
      >
        <h3 className="text-2xl">Recommended</h3>
        <div
          onClick={() => setChosenRide("affordable")}
          className={`cursor-pointer flex items-center justify-between gap-2 border-2 rounded-lg pl-2 pr-6 ${
            chosenRide === "affordable" ? "border-white" : "border-darkSecondary"
          }`}
        >
          <Image
            src="/car-primary.png"
            alt="Driver's Car"
            height={100}
            width={100}
          />
          <div className="text-3xl">
            <p>USD {cost.toFixed(2)}</p>
            <p className="text-white opacity-50 text-sm">Affordable</p>
          </div>
        </div>
        <div
          onClick={() => setChosenRide("high-quality")}
          className={`cursor-pointer flex items-center justify-between gap-2 border-2 rounded-lg pl-2 pr-6 ${
            chosenRide === "high-quality" ? "border-white" : "border-darkSecondary"
          }`}
        >
          <Image
            src="/car-primary.png"
            alt="Driver's Car"
            height={100}
            width={100}
          />
          <div className="text-3xl">
            <p>USD {(cost * 2).toFixed(2)}</p>
            <p className="text-white opacity-50 text-sm">High-Quality</p>
          </div>
        </div>

        <p className="opacity-50 text-sm">
          🕒 Estimated Arrival by {finalHours}:{finalMinutes.toString()} {finalPeriod}
        </p>

        <button className="bg-white disabled:bg-white/50 text-black rounded-lg py-3 px-6 w-full">
          Confirm Ride
        </button>
      </div>
    </div>
  );
};

export default ChooseRide;
