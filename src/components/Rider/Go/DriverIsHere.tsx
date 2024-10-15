'use client'
import { useAppSelector } from "@/redux/store";
import { LiveRideMapInfo } from "@/types";

const DriverIsHere = ({ handleCancelRide }: { handleCancelRide: any }) => {
  const liveRideInfo = useAppSelector((state) => state.main.liveRideInfo) as LiveRideMapInfo

  return (
    <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%] _animate-up">
      <h2 className="text-4xl">Your Driver is here.</h2>
      <div className="flex items-center gap-3">
        <img
          src="/pfp-placeholder.png"
          height={50}
          width={50}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-lg">{liveRideInfo.driverName}</p>
          <p className="opacity-75">{liveRideInfo.car}</p>
        </div>
      </div>
      <button onClick={handleCancelRide} className="bg-darkSecondary text-white rounded-lg w-full py-3">Cancel Ride</button>
    </div>
  );
};

export default DriverIsHere;