"use client";
import Image from "next/image";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const RideDetails = () => {
  const [chosenRide, setChosenRide] = useState("affordable");
  const [showOptions, setShowOptions] = useState(true);

  return (
    <div className="space-y-4 border border-darkSecondary rounded-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%]">
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
            chosenRide === "affordable"
              ? "border-white"
              : "border-darkSecondary"
          }`}
        >
          <Image
            src="/car-primary.png"
            alt="Driver's Car"
            height={100}
            width={100}
          />
          <div className="text-3xl">
            <p>USD 4.5</p>
            <p className="text-white opacity-50 text-sm">Affordable</p>
          </div>
        </div>
        <div
          onClick={() => setChosenRide("high-quality")}
          className={`cursor-pointer flex items-center justify-between gap-2 border-2 rounded-lg pl-2 pr-6 ${
            chosenRide === "high-quality"
              ? "border-white"
              : "border-darkSecondary"
          }`}
        >
          <Image
            src="/car-primary.png"
            alt="Driver's Car"
            height={100}
            width={100}
          />
          <div className="text-3xl">
            <p>USD 8.5</p>
            <p className="text-white opacity-50 text-sm">High-Quality</p>
          </div>
        </div>

        <button className="bg-white disabled:bg-white/50 text-black rounded-lg py-3 px-6 w-full">
          Confirm Ride
        </button>
      </div>
    </div>
  );
};

export default RideDetails;
