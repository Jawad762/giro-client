import { DriverInfo } from "@/types";
import React from "react";

const DriverFound = ({ driverInfo }: { driverInfo: DriverInfo }) => {
  return (
    <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%] _animate-up">
      <h2 className="text-4xl">Your Driver is on the way!</h2>
      <div className="flex items-center gap-3">
        <img
          src="/pfp-placeholder.png"
          height={50}
          width={50}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-lg">{driverInfo.driverName}</p>
          <p className="opacity-75">{driverInfo.car}</p>
        </div>
      </div>
      <button className="bg-darkSecondary text-white rounded-lg w-full py-3">Cancel Ride</button>
    </div>
  );
};

export default DriverFound;